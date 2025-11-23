import PDFParser from "pdf2json";

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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParser = new PDFParser();

    return new Promise((resolve, reject) => {
      pdfParser.on(
        "pdfParser_dataError",
        (errData: Error | { parserError: Error }) => {
          const error =
            errData instanceof Error ? errData : errData.parserError;
          reject(error);
        }
      );

      pdfParser.on(
        "pdfParser_dataReady",
        (pdfData: {
          Pages?: Array<{ Texts?: Array<{ R?: Array<{ T?: string }> }> }>;
        }) => {
          try {
            let text = "";
            if (pdfData.Pages) {
              for (const page of pdfData.Pages) {
                if (page.Texts) {
                  for (const textItem of page.Texts) {
                    if (textItem.R) {
                      for (const run of textItem.R) {
                        if (run.T) {
                          text += decodeURIComponent(run.T) + "\n";
                        }
                      }
                    }
                  }
                  text += "\n";
                }
              }
            }
            text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "");
            text = text.replace(/\n{3,}/g, "\n\n").trim();
            resolve(text);
          } catch (error) {
            reject(error);
          }
        }
      );

      pdfParser.parseBuffer(buffer);
    });
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
