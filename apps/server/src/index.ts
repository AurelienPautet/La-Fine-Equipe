import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import { db } from "@lafineequipe/db";
import { articles, tags, articleTags } from "@lafineequipe/db/src/schema";
import { ArticleWithTags, createArticleRequestSchema, createTagRequestSchema } from "@lafineequipe/types";
import { eq } from 'drizzle-orm';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Welcome to La Fine Equipe API!");
});

app.get("/api/articles", async (_, res) => {
  const allArticles = await db.select().from(articles).execute();
  let allArticlesWithTags: ArticleWithTags[] = [];
  for (const article of allArticles) {
    const articleTagRelations = await db
      .select()
      .from(articleTags)
      .where(eq(articleTags.articleId, article.id))
      .execute();
    const tagIds = articleTagRelations.map((relation) => relation.tagId);
    allArticlesWithTags.push({ ...article, tags: tagIds });
  }

  res.json(allArticlesWithTags);
});

app.post("/api/articles", async (req, res) => {
  try {
    const validatedData = createArticleRequestSchema.parse(req.body);    
    const { title, slug, content, author, tagsId } = validatedData;
    const [article] = await db.insert(articles).values({ title, content, author, slug }).returning().execute();
    console.log(article);
    
    for(const tagId of tagsId){
      await db.insert(articleTags).values({ articleId: article.id, tagId }).execute();
    }
    res.status(201).json({ success: true, data: article });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to create article' });
  }
});

app.post("/api/tags", async (req, res) => {
  try {
    const validatedData = createTagRequestSchema.parse(req.body);
    
    const { name } = validatedData;
    const [tag] = await db.insert(tags).values({ name }).returning().execute();
    
    res.status(201).json({ success: true, data: tag });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: 'Failed to create tag' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
