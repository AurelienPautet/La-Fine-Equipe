interface EventsMetadata {
  title: string;
  author: string;
  date: string;
  tags: string;
}

interface ParsedEvents {
  metadata: EventsMetadata;
  content: string;
  fullContent: string;
}

/**
 * Parses a markdown file with frontmatter and extracts metadata and content
 * @param markdownText - The raw markdown text including frontmatter
 * @returns Parsed events with metadata and content
 */
export const parseMarkdownWithFrontmatter = (
  markdownText: string
): ParsedEvents => {
  // Extract frontmatter
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = markdownText.match(frontMatterRegex);

  let metadata: EventsMetadata = {
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
 * Fetches and parses a markdown events from the public/posts directory
 * @param slug - The events slug (filename without .md extension)
 * @returns Promise that resolves to parsed events data
 */
export const fetchEvents = async (slug: string): Promise<ParsedEvents> => {
  try {
    const response = await fetch(`/posts/${slug}.md`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch events: ${response.status} ${response.statusText}`
      );
    }

    const text = await response.text();
    return parseMarkdownWithFrontmatter(text);
  } catch (error) {
    console.error(`Error fetching events "${slug}":`, error);
    throw error;
  }
};

/**
 * Fetches metadata only for an events (useful for events lists/cards)
 * @param slug - The events slug (filename without .md extension)
 * @returns Promise that resolves to events metadata
 */
export const fetchEventsMetadata = async (
  slug: string
): Promise<EventsMetadata> => {
  const events = await fetchEvents(slug);
  return events.metadata;
};
