import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as zod from "zod";

const ErrorResponse = zod.object({ error: zod.string() });

const router: IRouter = Router();

router.post("/subscribe", async (req, res): Promise<void> => {
  const parsed = zod.object({ email: zod.string().email() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(ErrorResponse.parse({ error: "সঠিক ইমেইল দিন" }));
    return;
  }

  try {
    await db.insert(subscribersTable).values({ email: parsed.data.email });
    res.json({ message: "সাবস্ক্রাইব সফল হয়েছে!" });
  } catch {
    res.status(409).json(ErrorResponse.parse({ error: "এই ইমেইল আগেই সাবস্ক্রাইব করা আছে" }));
  }
});

router.get("/admin/subscribers", requireAdmin, async (_req, res): Promise<void> => {
  const subs = await db
    .select()
    .from(subscribersTable)
    .orderBy(subscribersTable.subscribedAt);

  res.json(
    subs.map((s) => ({
      id: s.id,
      email: s.email,
      subscribedAt: s.subscribedAt.toISOString(),
    }))
  );
});

export default router;
