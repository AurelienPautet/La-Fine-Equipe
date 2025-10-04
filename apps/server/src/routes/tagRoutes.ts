import { Router } from "express";
import { createTag } from "../controllers/tagController";

const router = Router();

router.post("/", createTag);

export default router;
