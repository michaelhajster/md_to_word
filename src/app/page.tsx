"use client";

import React, { useState, useEffect } from "react";
import MarkdownInput from "@/components/MarkdownInput";
import MarkdownPreview from "@/components/MarkdownPreview";
import CopyButton from "@/components/CopyButton";
import StyleOptions from "@/components/StyleOptions";
import DownloadButton from "@/components/DownloadButton";
import { marked } from "marked";

export default function Home() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  
  // Style options state
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [lineHeight, setLineHeight] = useState("1.5");
  const [textAlign, setTextAlign] = useState("left");
  const [useGermanStyle, setUseGermanStyle] = useState(false);

  // Configure marked options for Word-friendly HTML
  useEffect(() => {
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
      pedantic: false, // Don't be too strict
    });
  }, []);

  // Update HTML when markdown changes
  const handleMarkdownChange = (value: string) => {
    setMarkdown(value);
    try {
      const parsedHtml = marked.parse(value || "") as string;
      setHtml(parsedHtml);
    } catch (error) {
      console.error("Error parsing markdown:", error);
      setHtml("<p>Error parsing markdown</p>");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Markdown to Word Converter
          </h1>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Markdown Input
              </h2>
              <MarkdownInput
                value={markdown}
                onChange={handleMarkdownChange}
              />
              
              {/* Style Options */}
              <StyleOptions 
                fontSize={fontSize}
                fontFamily={fontFamily}
                lineHeight={lineHeight}
                textAlign={textAlign}
                useGermanStyle={useGermanStyle}
                onFontSizeChange={setFontSize}
                onFontFamilyChange={setFontFamily}
                onLineHeightChange={setLineHeight}
                onTextAlignChange={setTextAlign}
                onUseGermanStyleChange={setUseGermanStyle}
              />
            </div>

            {/* Preview Section - Takes 2 columns */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Preview
                </h2>
                <div className="flex space-x-2">
                  <DownloadButton html={html} title="Markdown Document" useGermanStyle={useGermanStyle} />
                  <CopyButton contentToCopy={html} useGermanStyle={useGermanStyle} />
                </div>
              </div>
              <MarkdownPreview 
                markdown={markdown} 
                fontSize={fontSize}
                fontFamily={fontFamily}
                lineHeight={lineHeight}
                textAlign={textAlign}
                useGermanStyle={useGermanStyle}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Use
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Enter or paste your Markdown content in the input area.</li>
              <li>
                Customize the appearance using the styling options.
              </li>
              <li>
                The preview will show how it will look when pasted into Word.
              </li>
              <li>
                Click the "Copy to Clipboard" button to copy the formatted
                content, or use "Download as DOCX" to download a Word document.
              </li>
              <li>
                If using copy, open Microsoft Word and paste (Ctrl+V or Cmd+V) the content.
              </li>
              <li>
                The formatting from the Markdown should be preserved in Word.
              </li>
            </ol>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Markdown to Word Converter. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
