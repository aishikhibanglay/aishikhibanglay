import { Router, type IRouter } from "express";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminLogoutResponse,
} from "@workspace/api-zod";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import * as zod from "zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const ErrorResponse = zod.object({ error: zod.string() });

const router: IRouter = Router();

async function getAdminCredentials(): Promise<{ username: string; password: string }> {
  try {
    const rows = await db
      .select()
      .from(siteSettingsTable)
      .where(
        eq(siteSettingsTable.key, "admin_username_override")
      );
    const pwRows = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, "admin_password_override"));

    const username =
      rows[0]?.value || process.env.ADMIN_USERNAME || "admin";
    const password =
      pwRows[0]?.value || process.env.ADMIN_PASSWORD || "admin123";

    return { username, password };
  } catch {
    return {
      username: process.env.ADMIN_USERNAME ?? "admin",
      password: process.env.ADMIN_PASSWORD ?? "admin123",
    };
  }
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(ErrorResponse.parse({ error: "Invalid request body" }));
    return;
  }

  const { username, password } = parsed.data;
  const creds = await getAdminCredentials();

  if (username !== creds.username || password !== creds.password) {
    res.status(401).json(ErrorResponse.parse({ error: "ইউজারনেম বা পাসওয়ার্ড সঠিক নয়" }));
    return;
  }

  req.session.adminUsername = username;
  res.json(AdminLoginResponse.parse({ username }));
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json(AdminLogoutResponse.parse({ message: "Logged out" }));
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  if (!req.session.adminUsername) {
    res.status(401).json(ErrorResponse.parse({ error: "Not authenticated" }));
    return;
  }
  res.json(AdminLoginResponse.parse({ username: req.session.adminUsername }));
});

const ChangeCredentialsBody = zod.object({
  currentPassword: zod.string(),
  newUsername: zod.string().min(3, "ইউজারনেম কমপক্ষে ৩ অক্ষর হতে হবে"),
  newPassword: zod.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});

async function upsertSetting(key: string, value: string) {
  const existing = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.key, key));

  if (existing.length > 0) {
    await db
      .update(siteSettingsTable)
      .set({ value })
      .where(eq(siteSettingsTable.key, key));
  } else {
    await db.insert(siteSettingsTable).values({ key, value });
  }
}

router.post("/admin/change-credentials", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ChangeCredentialsBody.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Invalid input";
    res.status(400).json({ error: msg });
    return;
  }

  const { currentPassword, newUsername, newPassword } = parsed.data;
  const creds = await getAdminCredentials();

  if (currentPassword !== creds.password) {
    res.status(401).json({ error: "বর্তমান পাসওয়ার্ড সঠিক নয়" });
    return;
  }

  await upsertSetting("admin_username_override", newUsername);
  await upsertSetting("admin_password_override", newPassword);

  req.session.adminUsername = newUsername;
  res.json({ ok: true, username: newUsername });
});

const ResetWithRecoveryBody = zod.object({
  recoveryKey: zod.string(),
  newUsername: zod.string().min(3, "ইউজারনেম কমপক্ষে ৩ অক্ষর হতে হবে"),
  newPassword: zod.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});

router.post("/admin/reset-password", async (req, res): Promise<void> => {
  const parsed = ResetWithRecoveryBody.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? "Invalid input";
    res.status(400).json({ error: msg });
    return;
  }

  const { recoveryKey, newUsername, newPassword } = parsed.data;
  const masterKey = process.env.ADMIN_PASSWORD ?? "admin123";

  if (recoveryKey !== masterKey) {
    res.status(401).json({ error: "Recovery key সঠিক নয়" });
    return;
  }

  await upsertSetting("admin_username_override", newUsername);
  await upsertSetting("admin_password_override", newPassword);

  res.json({ ok: true });
});

export default router;
