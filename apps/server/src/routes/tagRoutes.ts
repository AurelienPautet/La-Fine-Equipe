import { Router } from "express";
import { createTag, getTags, deleteTag } from "../controllers/tagController";

import { verifyToken } from "../controllers/authController";
const router = Router();

router.get("/", getTags);

router.post("/", verifyToken, createTag);
router.delete("/:id", verifyToken, deleteTag);

export default router;
