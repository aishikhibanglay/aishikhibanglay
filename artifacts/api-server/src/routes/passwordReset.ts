import { Router } from "express";
import crypto from "crypto";
import { db, passwordResetTokensTable, siteSettingsTable } from "@workspace/db";
import { eq, and, gt, isNull } from "drizzle-orm";
import { sendPasswordResetEmail } from "../lib/mailer";
import * as zod from "zod";

const router = Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "aishikhibanglay@gmail.com";
const BASE_URL = process.env.APP_BASE_URL ?? "";

async function upsertSetting(key: string, value: string) {
  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
  if (existing.length > 0) {
    await db.update(siteSettingsTable).set({ value }).where(eq(siteSettingsTable.key, key));
  } else {
    await db.insert(siteSettingsTable).values({ key, value });
  }
}

router.post("/admin/forgot-password", async (req, res): Promise<void> => {
  const body = zod.object({ email: zod.string().email() }).safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "বৈধ ইমেইল দিন" });
    return;
  }

  if (body.data.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    // Always respond success to prevent email enumeration
    res.json({ ok: true });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await db.insert(passwordResetTokensTable).values({ token, expiresAt });

  const domain =
    req.headers["x-forwarded-host"]?.toString() ||
    req.headers["host"] ||
    BASE_URL;
  const proto = req.headers["x-forwarded-proto"] ?? "https";
  const resetLink = `${proto}://${domain}/admin/reset-password?token=${token}`;

  try {
    await sendPasswordResetEmail(ADMIN_EMAIL, resetLink);
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ error: "ইমেইল পাঠাতে সমস্যা হয়েছে। SMTP সেটিংস চেক করুন।" });
    return;
  }

  res.json({ ok: true });
});

router.post("/admin/reset-password-via-token", async (req, res): Promise<void> => {
  const body = zod
    .object({
      token: zod.string(),
      newUsername: zod.string().min(3, "ইউজারনেম কমপক্ষে ৩ অক্ষর হতে হবে"),
      newPassword: zod.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
    })
    .safeParse(req.body);

  if (!body.success) {
    const msg = body.error.errors[0]?.message ?? "Invalid input";
    res.status(400).json({ error: msg });
    return;
  }

  const { token, newUsername, newPassword } = body.data;
  const now = new Date();

  const [row] = await db
    .select()
    .from(passwordResetTokensTable)
    .where(
      and(
        eq(passwordResetTokensTable.token, token),
        isNull(passwordResetTokensTable.usedAt),
        gt(passwordResetTokensTable.expiresAt, now)
      )
    );

  if (!row) {
    res.status(400).json({ error: "লিংকটি মেয়াদোত্তীর্ণ বা ইতিমধ্যে ব্যবহার হয়েছে" });
    return;
  }

  await db
    .update(passwordResetTokensTable)
    .set({ usedAt: now })
    .where(eq(passwordResetTokensTable.id, row.id));

  await upsertSetting("admin_username_override", newUsername);
  await upsertSetting("admin_password_override", newPassword);

  res.json({ ok: true });
});

export default router;
