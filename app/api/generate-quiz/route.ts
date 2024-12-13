import { pdfExtractSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import FirecrawlApp from '@mendable/firecrawl-js';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files, url } = await req.json();
  
  let content = '';
  
  if (url) {
    const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });
    
    const scrapeResponse = await app.scrapeUrl(url, {
      formats: ['markdown'],
    });

    if (!scrapeResponse.success) {
      throw new Error(`Failed to scrape: ${scrapeResponse.error}`);
    }

    content = scrapeResponse.markdown ?? '';
    console.log(content);
  } else if (files && files.length > 0) {
    content = files[0]?.data ?? '';
  } else {
    throw new Error('No content provided');
  }

  const result = await streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          "You are a document analyzer. Extract the most important points from the provided document. Focus on key information, main ideas, and significant details.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: url 
              ? "Please analyze this webpage content and extract the key points. Include relevant context where helpful."
              : "Please read this PDF and extract the key points. Include relevant context where helpful.",
          },
          {
            type: "text",
            text: content,
          },
        ],
      },
    ],
    schema: pdfExtractSchema,
    output: "object",
    onFinish: ({ object }) => {
      const res = pdfExtractSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
