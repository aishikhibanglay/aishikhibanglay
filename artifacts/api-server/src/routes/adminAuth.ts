import { Router, type IRouter } from "express";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminLogoutResponse,
} from "@workspace/api-zod";
import * as zod from "zod";

const ErrorResponse = zod.object({ error: zod.string() });

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(ErrorResponse.parse({ error: "Invalid request body" }));
    return;
  }

  const { username, password } = parsed.data;
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  if (username !== adminUsername || password !== adminPassword) {
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

export default router;
