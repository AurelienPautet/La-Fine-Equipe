import { Router } from "express";
import { getAllArticles, createArticle, getArticleBySlug } from "../controllers/articleController";

const router = Router();

router.get("/", getAllArticles);
router.post("/", createArticle);
router.get("/:slug", getArticleBySlug);

export default router;
