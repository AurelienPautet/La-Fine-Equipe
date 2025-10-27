import { Router } from "express";
import { createTag, getTags, deleteTag } from "../controllers/tagController";

const router = Router();

router.post("/", createTag);
router.get("/", getTags);
router.delete("/:id", deleteTag);

export default router;
