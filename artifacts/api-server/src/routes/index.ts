import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import adminAuthRouter from "./adminAuth";
import adminPostsRouter from "./adminPosts";
import storageRouter from "./storage";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(adminAuthRouter);
router.use(adminPostsRouter);
router.use("/storage/uploads", requireAdmin);
router.use(storageRouter);

export default router;
