import Router from "express";

import { deleteFile, uploadFile } from "../controllers/fileController";
import { verifyToken } from "../controllers/authController";

const router = Router();

router.post("/upload/:folder", verifyToken, uploadFile);
router.delete("/delete", verifyToken, deleteFile);

export default router;
