import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import adminAuthRouter from "./adminAuth";
import adminPostsRouter from "./adminPosts";
import storageRouter from "./storage";
import settingsRouter from "./settings";
import subscribersRouter from "./subscribers";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

// Public routes first — before any admin middleware
router.use(healthRouter);
router.use(postsRouter);
router.use(settingsRouter);
router.use(subscribersRouter);

// Auth routes (login/logout/me — mixed public + protected, self-contained)
router.use(adminAuthRouter);

// Protected admin routes
router.use(adminPostsRouter);
router.use("/storage/uploads", requireAdmin);
router.use(storageRouter);

export default router;
