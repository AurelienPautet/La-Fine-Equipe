import type {
  CreateArticleRequest,
  ArticleWithTags,
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

export async function getLatestArticle(): Promise<ArticleWithTags> {
  const response = await fetch(`${API_URL}/api/articles/latest`);

  if (!response.ok) {
    throw new Error("Failed to fetch latest article");
  }

  const article = await response.json();
  return article.data;
}

export async function postArticleMutation(
  articleData: CreateArticleRequest
): Promise<ArticleWithTags> {
  const response = await fetch(`${API_URL}/api/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });

  if (!response.ok) {
    throw new Error("Failed to create article");
  }

  const article = await response.json();
  return article;
}

export async function editArticleMutation({
  id,
  articleData,
}: {
  id: number;
  articleData: CreateArticleRequest;
}): Promise<ArticleWithTags> {
  const response = await fetch(`${API_URL}/api/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });

  if (!response.ok) {
    throw new Error("Failed to edit article");
  }

  const article = await response.json();
  return article;
}
