import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import { db } from "@lafineequipe/db";
import { articles, tags, articleTags } from "@lafineequipe/db/src/schema";
import { InferSelectModel } from "drizzle-orm";

interface ArticleWithTags extends InferSelectModel<typeof articles> {
  tags: (number | null)[];
};
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
  const { title, content, author, tagsId } = req.body;
  const [article] = await db.insert(articles).values({ title, content, author }).returning().execute();
  console.log(article);
  for(const tagId of tagsId){
    await db.insert(articleTags).values({ articleId: article.id, tagId }).execute();
  }
  res.status(201).send("Article created!");
});

app.post("/api/tags", async (req, res) => {
  const { name } = req.body;
  await db.insert(tags).values({ name }).execute();
  res.status(201).send("Tag created!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
