import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { articles, tags, articleTags } from "@lafineequipe/db/src/schema";
import {
  ArticleWithTags,
  createArticleRequestSchema,
} from "@lafineequipe/types";
import { eq, desc, SQL } from "drizzle-orm";

const getArticlesWithTags = async (
  whereCondition?: SQL,
  orderBy?: SQL
): Promise<ArticleWithTags[]> => {
  let query = db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      content: articles.content,
      author: articles.author,
      date: articles.date,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      tagName: tags.name,
    })
    .from(articles)
    .leftJoin(articleTags, eq(articles.id, articleTags.articleId))
    .leftJoin(tags, eq(articleTags.tagId, tags.id));

  if (whereCondition) {
    query = query.where(whereCondition) as any;
  }

  if (orderBy) {
    query = query.orderBy(orderBy) as any;
  }

  const results = await query.execute();

  const articlesMap = new Map<number, ArticleWithTags>();

  for (const row of results) {
    if (!articlesMap.has(row.id)) {
      articlesMap.set(row.id, {
        id: row.id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        author: row.author,
        date: row.date,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        tags: row.tagName ? [row.tagName] : [],
      });
    } else if (row.tagName) {
      articlesMap.get(row.id)!.tags.push(row.tagName);
    }
  }

  return Array.from(articlesMap.values());
};

export const getAllArticles = async (_req: Request, res: Response) => {
  try {
    const allArticlesWithTags = await getArticlesWithTags();
    res.json(allArticlesWithTags);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch articles" });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const validatedData = createArticleRequestSchema.parse(req.body);
    const { title, content, author, date, tagsId } = validatedData;

    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const existingArticle = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .execute();
    if (existingArticle.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Slug already exists. Please choose a different title.",
      });
    }

    const [article] = await db
      .insert(articles)
      .values({ title, content, author, slug, date })
      .returning()
      .execute();

    for (const tagId of tagsId) {
      await db
        .insert(articleTags)
        .values({ articleId: article.id, tagId })
        .execute();
    }

    res.status(201).json({ success: true, data: article });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: "Failed to create article" });
  }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const articlesWithTags = await getArticlesWithTags(eq(articles.slug, slug));

    if (articlesWithTags.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Article not found" });
    }

    res.json({ success: true, data: articlesWithTags[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch article" });
  }
};

export const getLatestArticle = async (req: Request, res: Response) => {
  try {
    const allArticles = await getArticlesWithTags(
      undefined,
      desc(articles.date)
    );

    if (allArticles.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No articles found" });
    }

    res.json({ success: true, data: allArticles[0] });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch latest article" });
  }
};
