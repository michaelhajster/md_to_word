"use client";

import React, { useEffect, useState } from "react";
import { marked } from "marked";

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
  fontSize?: string;
  fontFamily?: string;
  lineHeight?: string;
  textAlign?: string;
  useGermanStyle?: boolean;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  markdown,
  className = "",
  fontSize = "16px",
  fontFamily = "Arial, sans-serif",
  lineHeight = "1.5",
  textAlign = "left",
  useGermanStyle = false,
}) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    // Configure marked options for Word-friendly HTML
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
      pedantic: false, // Don't be too strict
    });

    // Convert markdown to HTML
    try {
      const parsedHtml = marked.parse(markdown || "") as string;
      setHtml(parsedHtml);
    } catch (error) {
      console.error("Error parsing markdown:", error);
      setHtml("<p>Error parsing markdown</p>");
    }
  }, [markdown]);

  // Apply Word-friendly styles with custom options
  const previewStyles = `
    .markdown-preview {
      font-family: ${fontFamily};
      font-size: ${fontSize};
      line-height: ${lineHeight};
      text-align: ${textAlign};
    }
    .markdown-preview h1 { 
      font-size: ${useGermanStyle ? '12px' : '2em'}; 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-weight: bold; 
      margin-top: 0.67em; 
      margin-bottom: 0.67em; 
    }
    .markdown-preview h2 { 
      font-size: ${useGermanStyle ? '12px' : '1.5em'}; 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-weight: bold; 
      margin-top: 0.83em; 
      margin-bottom: 0.83em; 
    }
    .markdown-preview h3 { 
      font-size: ${useGermanStyle ? '12px' : '1.17em'}; 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-weight: bold; 
      margin-top: 1em; 
      margin-bottom: 1em; 
    }
    .markdown-preview h4 { 
      font-size: ${useGermanStyle ? '12px' : '1em'}; 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-weight: bold; 
      margin-top: 1.33em; 
      margin-bottom: 1.33em; 
    }
    .markdown-preview h5 { 
      font-size: ${useGermanStyle ? '12px' : '0.83em'}; 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-weight: bold; 
      margin-top: 1.67em; 
      margin-bottom: 1.67em; 
    }
    .markdown-preview h6 { 
      font-size: ${useGermanStyle ? '12px' : '0.67em'}; 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-weight: bold; 
      margin-top: 2.33em; 
      margin-bottom: 2.33em; 
    }
    .markdown-preview p { margin-top: 1em; margin-bottom: 1em; }
    .markdown-preview ul, .markdown-preview ol { 
      padding-left: 2em; 
      margin-top: 1em; 
      margin-bottom: 1em; 
      text-align: ${useGermanStyle ? 'left' : textAlign}; 
    }
    .markdown-preview blockquote { border-left: 4px solid #ccc; padding-left: 1em; margin-left: 0; }
    .markdown-preview pre { background-color: #f5f5f5; padding: 1em; overflow: auto; }
    .markdown-preview code { background-color: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; }
    .markdown-preview table { border-collapse: collapse; width: 100%; }
    .markdown-preview th, .markdown-preview td { border: 1px solid #ddd; padding: 8px; }
    .markdown-preview th { background-color: #f2f2f2; }
    .markdown-preview a { color: #0366d6; text-decoration: underline; }
    .markdown-preview img { max-width: 100%; }
    .markdown-preview .footnote { font-size: ${useGermanStyle ? '10px' : fontSize}; }
  `;

  return (
    <div className={`w-full ${className}`}>
      <style>{previewStyles}</style>
      <div 
        className="markdown-preview p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[200px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default MarkdownPreview; 