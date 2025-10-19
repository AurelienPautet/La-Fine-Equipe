import Router from "express";

import { deleteFile, uploadFile } from "../controllers/fileController";
const router = Router();

router.post("/upload/:folder", uploadFile);
router.delete("/delete", deleteFile);

export default router;
