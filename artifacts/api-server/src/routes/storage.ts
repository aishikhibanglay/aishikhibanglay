import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const sess = req.session as any;
  if (!sess?.adminLoggedIn) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post(
  "/storage/upload",
  requireAdmin,
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    try {
      const { buffer, mimetype, originalname } = req.file;
      const url = await objectStorageService.uploadFile(buffer, mimetype, originalname);
      res.json({ url });
    } catch (error) {
      req.log.error({ err: error }, "Error uploading file");
      res.status(500).json({ error: "Upload failed. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set and the 'uploads' bucket exists." });
    }
  }
);

export default router;
