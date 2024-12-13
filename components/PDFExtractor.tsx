"use client";

import { useState } from "react";
import { experimental_useObject } from "ai/react";
import { toast } from "sonner";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { pdfExtractSchema, type PDFExtract } from "@/lib/schemas";

interface PDFExtractorProps {
  onExtractComplete?: (content: PDFExtract) => void;
  onPartialContent?: (content: Partial<PDFExtract>) => void;
}

export default function PDFExtractor({
  onExtractComplete,
  onPartialContent,
}: PDFExtractorProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const {
    submit,
    object: extractedContent,
    isLoading,
  } = experimental_useObject<PDFExtract>({
    api: "/api/generate-quiz",
    schema: pdfExtractSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to analyze PDF. Please try again.");
      setFiles([]);
      setUrl("");
    },
    onFinish: ({ object }) => {
      if (object) {
        onExtractComplete?.(object);
        onPartialContent?.(object);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker."
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
    setUrl("");
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (files.length > 0) {
        const encodedFiles = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            type: file.type,
            data: await encodeFileAsBase64(file),
          }))
        );
        submit({ files: encodedFiles });
      } else if (url) {
        try {
          new URL(url);
          submit({ url });
        } catch {
          toast.error("Please enter a valid URL");
          return;
        }
      } else {
        toast.error("Please upload a PDF or enter a URL.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value) {
      setFiles([]);
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none flex flex-col">
      <CardHeader className="text-center space-y-6 flex-shrink-0">
        <div className="space-y-2 mt-4">
          <CardTitle className="text-2xl mb-4 tracking-normal font-bold">
            Mind Map Maker
          </CardTitle>
          <CardDescription className="text-base">
            Upload a PDF or enter a URL to generate a mind map using{" "}
            <Link href="https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai">
              Google&apos;s Gemini Pro
            </Link>
            .
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="space-y-4 flex-shrink-0">
          <div
            className={`relative flex flex-col items-center justify-center 
            border border-dashed border-muted-foreground/25 
            bg-[#FCFCFC] hover:bg-[#F5F5F5] transition duration-500 hover:duration-200
            rounded-lg px-8 py-6 transition-colors
            ${url ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileUp className="h-8 w-8 mb-4 text-zinc-400" />
            <p className="text-sm text-zinc-500 text-center px-8">
              {files.length > 0 ? (
                <span className="font-medium">{files[0].name}</span>
              ) : (
                <span>Drop your PDF here (max 5 MB) or click to browse.</span>
              )}
            </p>
          </div>
          <div
            className={`relative flex flex-col items-center justify-center 
            border border-dashed border-muted-foreground/25 
            bg-[#FCFCFC] hover:bg-[#F5F5F5] transition duration-500 hover:duration-200
            rounded-lg px-8 py-6 transition-colors
            ${files.length > 0 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="Or enter a webpage URL"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-500 font-mono 
            shadow-md shadow-orange-800/20
            hover:bg-orange-600 hover:shadow-orange-800/30
            active:shadow-none transition-all duration-400"
            disabled={files.length === 0 && !url}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing...</span>
              </span>
            ) : (
              "Extract key points"
            )}
          </Button>
        </form>

        {extractedContent && extractedContent.keyPoints && (
          <div className="flex-1 flex flex-col overflow-hidden mt-8 min-h-0">
            <h2 className="text-sm text-zinc-400 font-mono flex-shrink-0">
              KEY POINTS
            </h2>
            <div
              className="flex-1 overflow-y-auto mt-4 pr-2 min-h-0
                    scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent
                    hover:scrollbar-thumb-gray-400"
            >
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">
                  {extractedContent.title}
                </h3>
                <ul className="space-y-3">
                  {extractedContent.keyPoints.reduce(
                    (acc: JSX.Element[], item, index) => {
                      if (item && extractedContent.keyPoints) {
                        if (
                          index === 0 ||
                          item.context !==
                            extractedContent.keyPoints[index - 1]?.context
                        ) {
                          acc.push(
                            <h4
                              key={`context-${index}`}
                              className="font-medium text-md mt-2"
                            >
                              {item.context || "General"}
                            </h4>
                          );
                        }

                        acc.push(
                          <li key={index} className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {item.point}
                            </p>
                          </li>
                        );
                      }
                      return acc;
                    },
                    []
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-shrink-0">
        {isLoading && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Analyzing document...</span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
