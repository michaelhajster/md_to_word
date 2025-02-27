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
    // Configure marked options to match ChatGPT's rendering
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert line breaks to <br>
      pedantic: false, // Don't be too strict
    });

    // Apply custom styles to the HTML after parsing
    function applyCustomStyles(html: string): string {
      // Create a temporary DOM element to manipulate the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Apply styles to headings
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        heading.setAttribute('style', 'margin-top: 1em; margin-bottom: 0.5em; font-weight: bold;');
      });
      
      // Apply styles to blockquotes
      const blockquotes = tempDiv.querySelectorAll('blockquote');
      blockquotes.forEach(blockquote => {
        const style = 'border-left: 3px solid #666; padding-left: 1em; margin-left: 0; margin-right: 0;';
        
        // Check if this is a conclusion blockquote
        if (blockquote.textContent?.toLowerCase().includes('conclusion')) {
          blockquote.setAttribute('style', style + ' font-style: italic;');
        } else {
          blockquote.setAttribute('style', style);
        }
      });
      
      // Apply styles to lists
      const lists = tempDiv.querySelectorAll('ul, ol');
      lists.forEach(list => {
        list.setAttribute('style', 'padding-left: 2em; margin-top: 0.5em; margin-bottom: 0.5em;');
      });
      
      // Apply styles to list items
      const listItems = tempDiv.querySelectorAll('li');
      listItems.forEach(item => {
        item.setAttribute('style', 'margin-bottom: 0.25em;');
      });
      
      // Apply styles to paragraphs
      const paragraphs = tempDiv.querySelectorAll('p');
      paragraphs.forEach(p => {
        p.setAttribute('style', 'margin-top: 0.5em; margin-bottom: 0.5em;');
      });
      
      // Apply styles to code blocks
      const codeBlocks = tempDiv.querySelectorAll('pre code');
      codeBlocks.forEach(code => {
        const pre = code.parentElement;
        if (pre) {
          pre.setAttribute('style', 'background-color: #f5f5f5; padding: 1em; overflow: auto; border-radius: 4px; font-family: monospace; font-size: 0.9em; margin: 1em 0;');
        }
      });
      
      // Apply styles to inline code
      const inlineCodes = tempDiv.querySelectorAll('code:not(pre code)');
      inlineCodes.forEach(code => {
        code.setAttribute('style', 'background-color: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 0.9em;');
      });
      
      // Apply styles to horizontal rules
      const hrs = tempDiv.querySelectorAll('hr');
      hrs.forEach(hr => {
        hr.setAttribute('style', 'border: none; border-top: 1px solid #999; margin: 2em 0;');
      });
      
      return tempDiv.innerHTML;
    }

    // Convert markdown to HTML
    try {
      const parsedHtml = marked.parse(markdown || "") as string;
      const styledHtml = applyCustomStyles(parsedHtml);
      setHtml(styledHtml);
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
      color: #000000;
    }
    
    /* ChatGPT-like styling for headings */
    .markdown-preview h1, 
    .markdown-preview h2, 
    .markdown-preview h3, 
    .markdown-preview h4, 
    .markdown-preview h5, 
    .markdown-preview h6 { 
      font-family: ${useGermanStyle ? 'Calibri, sans-serif' : fontFamily};
      font-weight: bold; 
      margin-top: 1.2em; 
      margin-bottom: 0.8em; 
      color: #000;
      line-height: 1.2;
    }
    
    .markdown-preview h1 { font-size: ${useGermanStyle ? '12pt' : '1.8em'}; }
    .markdown-preview h2 { font-size: ${useGermanStyle ? '12pt' : '1.5em'}; }
    .markdown-preview h3 { font-size: ${useGermanStyle ? '12pt' : '1.3em'}; }
    .markdown-preview h4 { font-size: ${useGermanStyle ? '12pt' : '1.2em'}; }
    .markdown-preview h5 { font-size: ${useGermanStyle ? '12pt' : '1.1em'}; }
    .markdown-preview h6 { font-size: ${useGermanStyle ? '12pt' : '1em'}; }
    
    /* ChatGPT-like styling for paragraphs */
    .markdown-preview p { 
      margin-top: 0.8em; 
      margin-bottom: 0.8em; 
      text-align: ${useGermanStyle ? 'justify' : textAlign}; 
    }
    
    /* ChatGPT-like styling for lists */
    .markdown-preview ul, 
    .markdown-preview ol { 
      padding-left: 2em; 
      margin-top: 0.8em; 
      margin-bottom: 0.8em; 
      text-align: left; /* Lists are always left-aligned, even in German style */
    }
    
    .markdown-preview li {
      margin-bottom: 0.3em;
    }
    
    .markdown-preview li p {
      margin-top: 0.3em;
      margin-bottom: 0.3em;
    }
    
    /* ChatGPT-like styling for blockquotes */
    .markdown-preview blockquote { 
      border-left: 3px solid #666; 
      padding-left: 1em; 
      margin: 1em 0;
      font-style: ${useGermanStyle ? 'italic' : 'normal'};
    }
    
    /* Special styling for conclusion blockquotes */
    .markdown-preview blockquote p:first-child strong:first-child {
      font-weight: bold;
    }
    
    /* ChatGPT-like styling for horizontal rules */
    .markdown-preview hr {
      border: none;
      border-top: 1px solid #999;
      margin: 2em 0;
    }
    
    /* ChatGPT-like styling for code blocks */
    .markdown-preview pre { 
      background-color: #f5f5f5; 
      padding: 1em; 
      overflow: auto; 
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
      margin: 1em 0;
    }
    
    /* ChatGPT-like styling for inline code */
    .markdown-preview code { 
      background-color: #f5f5f5; 
      padding: 0.2em 0.4em; 
      border-radius: 3px; 
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.9em;
    }
    
    /* ChatGPT-like styling for tables */
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
    
    /* ChatGPT-like styling for links */
    .markdown-preview a { 
      color: #0366d6; 
      text-decoration: underline; 
    }
    
    /* ChatGPT-like styling for images */
    .markdown-preview img { 
      max-width: 100%; 
      height: auto;
      margin: 1em 0;
    }
    
    /* ChatGPT-like styling for footnotes */
    .markdown-preview .footnote { 
      font-size: ${useGermanStyle ? '10pt' : '0.8em'}; 
      color: #666;
    }
    
    /* ChatGPT-like styling for citations */
    .markdown-preview cite {
      display: block;
      text-indent: 2em;
    }
    
    /* Ensure proper spacing between elements */
    .markdown-preview > *:first-child {
      margin-top: 0;
    }
    
    .markdown-preview > *:last-child {
      margin-bottom: 0;
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