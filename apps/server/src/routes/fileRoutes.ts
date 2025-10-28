import Router from "express";

import { deleteFile, uploadFile } from "../controllers/fileController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/upload/:folder", authMiddleware, uploadFile);
router.delete("/delete", authMiddleware, deleteFile);

export default router;
