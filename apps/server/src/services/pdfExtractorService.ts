import { PDFParse } from "pdf-parse";

export function extractEmbeddedPdfUrls(content: string): string[] {
  const embedRegex = /<embed\s+src="([^"]+)"\s+type="application\/pdf"[^>]*>/gi;
  const matches = content.matchAll(embedRegex);
  const urls: string[] = [];

  for (const match of matches) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }

  return urls;
}

async function extractTextFromPdfUrl(url: string): Promise<string> {
  try {
    const parser = new PDFParse({ url });
    const result = await parser.getText();
    let text = (result.text as string) || "";

    text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "");
    text = text.replace(/\n{3,}/g, "\n\n").trim();

    return text;
  } catch (error) {
    console.error(`Error extracting text from PDF at ${url}:`, error);
    return "";
  }
}

export async function extractAllEmbeddedPdfText(
  content: string
): Promise<string> {
  const pdfUrls = extractEmbeddedPdfUrls(content);

  if (pdfUrls.length === 0) {
    return "";
  }

  const textPromises = pdfUrls.map((url) => extractTextFromPdfUrl(url));
  const texts = await Promise.all(textPromises);

  const combinedText = texts.filter((text) => text.trim()).join("\n\n");

  return combinedText;
}

export async function enrichContentWithPdfText(
  content: string
): Promise<string> {
  const pdfText = await extractAllEmbeddedPdfText(content);

  if (!pdfText) {
    return content;
  }

  return `${content}\n\n--- Contenu extrait des PDFs ---\n\n${pdfText}`;
}
