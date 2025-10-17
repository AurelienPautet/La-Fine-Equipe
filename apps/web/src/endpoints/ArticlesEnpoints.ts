import type {
  CreateArticleRequest,
  ArticleWithTags,
  EditArticleRequest,
} from "@lafineequipe/types";

import {
  createArticleRequestSchema,
  editArticleRequestSchema,
} from "@lafineequipe/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getArticles(): Promise<ArticleWithTags[]> {
  const response = await fetch(`${API_URL}/api/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  const articles = await response.json();
  return articles;
}

export async function getArticle(slug: string): Promise<ArticleWithTags> {
  const response = await fetch(`${API_URL}/api/articles/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const article = await response.json();
  return article.data;
}

export async function getLatestsArticle(): Promise<ArticleWithTags[]> {
  const response = await fetch(`${API_URL}/api/articles/latests`);

  if (!response.ok) {
    throw new Error("Failed to fetch latests article");
  }

  const articles = await response.json();
  return articles.data;
}

export async function postArticleMutation(
  articleData: CreateArticleRequest
): Promise<ArticleWithTags> {
  const validateData = createArticleRequestSchema.parse(articleData);
  const response = await fetch(`${API_URL}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    throw new Error("Failed to create article");
  }

  const article = await response.json();
  return article;
}

export async function editArticleMutation({
  articleData,
}: {
  articleData: EditArticleRequest;
}): Promise<ArticleWithTags> {
  const validateData = editArticleRequestSchema.parse(articleData);
  const response = await fetch(`${API_URL}/api/articles/${articleData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateData),
  });

  if (!response.ok) {
    throw new Error("Failed to edit article");
  }

  const article = await response.json();
  return article;
}
