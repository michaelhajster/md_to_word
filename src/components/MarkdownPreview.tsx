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
      font-family: ${useGermanStyle ? 'Palatino Linotype, serif' : fontFamily};
      font-size: ${useGermanStyle ? '11pt' : fontSize};
      line-height: ${useGermanStyle ? '1.5' : lineHeight};
      text-align: ${useGermanStyle ? 'justify' : textAlign};
      padding: 2em;
      max-width: 21cm; /* A4 width */
      margin: 0 auto;
    }
    .markdown-preview h1, 
    .markdown-preview h2, 
    .markdown-preview h3, 
    .markdown-preview h4, 
    .markdown-preview h5, 
    .markdown-preview h6 { 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-size: ${useGermanStyle ? '12pt' : 'inherit'};
      font-weight: bold; 
      margin-top: 1em; 
      margin-bottom: 0.5em; 
      color: #000;
    }
    .markdown-preview h1 { font-size: ${useGermanStyle ? '12pt' : '2em'}; }
    .markdown-preview h2 { font-size: ${useGermanStyle ? '12pt' : '1.5em'}; }
    .markdown-preview h3 { font-size: ${useGermanStyle ? '12pt' : '1.17em'}; }
    .markdown-preview h4 { font-size: ${useGermanStyle ? '12pt' : '1em'}; }
    .markdown-preview h5 { font-size: ${useGermanStyle ? '12pt' : '0.83em'}; }
    .markdown-preview h6 { font-size: ${useGermanStyle ? '12pt' : '0.67em'}; }
    
    .markdown-preview p { 
      margin-top: 0.5em; 
      margin-bottom: 0.5em; 
      text-align: ${useGermanStyle ? 'justify' : textAlign}; 
    }
    
    .markdown-preview ul, 
    .markdown-preview ol { 
      padding-left: 2em; 
      margin-top: 0.5em; 
      margin-bottom: 0.5em; 
      text-align: left; /* Lists are always left-aligned, even in German style */
    }
    
    .markdown-preview blockquote { 
      border-left: 3px solid #666; 
      padding-left: 1em; 
      margin-left: 0; 
      margin-right: 0;
      font-style: ${useGermanStyle ? 'italic' : 'normal'};
    }
    
    .markdown-preview blockquote p:first-child strong:first-child {
      font-weight: bold;
    }
    
    .markdown-preview hr {
      border: none;
      border-top: 1px solid #999;
      margin: 2em 0;
    }
    
    .markdown-preview pre { 
      background-color: #f5f5f5; 
      padding: 1em; 
      overflow: auto; 
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }
    
    .markdown-preview code { 
      background-color: #f5f5f5; 
      padding: 0.2em 0.4em; 
      border-radius: 3px; 
      font-family: monospace;
      font-size: 0.9em;
    }
    
    .markdown-preview table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 1em 0;
    }
    
    .markdown-preview th, 
    .markdown-preview td { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: left;
    }
    
    .markdown-preview th { 
      background-color: #f2f2f2; 
      font-weight: bold;
    }
    
    .markdown-preview a { 
      color: #0366d6; 
      text-decoration: underline; 
    }
    
    .markdown-preview img { 
      max-width: 100%; 
      height: auto;
    }
    
    .markdown-preview .footnote { 
      font-size: ${useGermanStyle ? '10pt' : '0.8em'}; 
      color: #666;
    }
    
    /* Special styling for conclusion sections */
    .markdown-preview blockquote p:first-child:contains("Conclusion") {
      font-weight: bold;
    }
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