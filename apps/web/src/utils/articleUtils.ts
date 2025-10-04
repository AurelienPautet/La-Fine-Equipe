interface ArticleMetadata {
  title: string;
  author: string;
  date: string;
  tags: string;
}

interface ParsedArticle {
  metadata: ArticleMetadata;
  content: string;
  fullContent: string;
}

/**
 * Parses a markdown file with frontmatter and extracts metadata and content
 * @param markdownText - The raw markdown text including frontmatter
 * @returns Parsed article with metadata and content
 */
export const parseMarkdownWithFrontmatter = (markdownText: string): ParsedArticle => {
  // Extract frontmatter
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = markdownText.match(frontMatterRegex);

  let metadata: ArticleMetadata = {
    title: "",
    author: "",
    date: "",
    tags: "",
  };

  let contentWithoutFrontmatter = markdownText;

  if (match) {
    const frontMatter = match[1];
    const lines = frontMatter.split("\n");

    lines.forEach((line) => {
      if (line.startsWith("title:")) {
        metadata.title = line.replace("title:", "").trim();
      } else if (line.startsWith("author:")) {
        metadata.author = line.replace("author:", "").trim();
      } else if (line.startsWith("date:")) {
        metadata.date = line.replace("date:", "").trim();
      } else if (line.startsWith("tags:")) {
        metadata.tags = line.replace("tags:", "").trim();
      }
    });

    // Remove frontmatter from content
    contentWithoutFrontmatter = markdownText
      .replace(frontMatterRegex, "")
      .trim();
  }

  return {
    metadata,
    content: contentWithoutFrontmatter,
    fullContent: markdownText,
  };
};

/**
 * Fetches and parses a markdown article from the public/posts directory
 * @param slug - The article slug (filename without .md extension)
 * @returns Promise that resolves to parsed article data
 */
export const fetchArticle = async (slug: string): Promise<ParsedArticle> => {
  try {
    const response = await fetch(`/posts/${slug}.md`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    return parseMarkdownWithFrontmatter(text);
  } catch (error) {
    console.error(`Error fetching article "${slug}":`, error);
    throw error;
  }
};

/**
 * Fetches metadata only for an article (useful for article lists/cards)
 * @param slug - The article slug (filename without .md extension)
 * @returns Promise that resolves to article metadata
 */
export const fetchArticleMetadata = async (slug: string): Promise<ArticleMetadata> => {
  const article = await fetchArticle(slug);
  return article.metadata;
};