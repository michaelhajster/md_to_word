"use client";

import React, { useState } from "react";
import { prepareHtmlForClipboard } from "@/lib/utils";

interface CopyButtonProps {
  contentToCopy: string;
  className?: string;
  useGermanStyle?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  contentToCopy,
  className = "",
  useGermanStyle = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!contentToCopy) return;

    try {
      // Process the HTML for better Word compatibility
      const processedHtml = prepareHtmlForClipboard(contentToCopy, useGermanStyle);
      
      // Add additional academic formatting for blockquotes and conclusions
      const enhancedHtml = processedHtml
        // Ensure proper styling for blockquotes (conclusions)
        .replace(/<blockquote[^>]*>/g, (match) => {
          if (useGermanStyle) {
            return '<blockquote style="border-left: 3px solid #666; padding-left: 10px; margin-left: 20px; font-style: italic; color: #000000;">';
          }
          return '<blockquote style="border-left: 3px solid #666; padding-left: 10px; margin-left: 20px; color: #000000;">';
        })
        // Ensure proper styling for strong/bold text
        .replace(/<(strong|b)[^>]*>/g, (match, tag) => {
          if (useGermanStyle) {
            return `<${tag} style="font-weight: bold; font-family: Palatino Linotype, serif;">`;
          }
          return `<${tag} style="font-weight: bold;">`;
        })
        // Ensure proper styling for emphasis/italic text
        .replace(/<(em|i)[^>]*>/g, (match, tag) => {
          if (useGermanStyle) {
            return `<${tag} style="font-style: italic; font-family: Palatino Linotype, serif;">`;
          }
          return `<${tag} style="font-style: italic;">`;
        });
      
      // Create a temporary element to hold the HTML
      const tempElement = document.createElement("div");
      tempElement.innerHTML = enhancedHtml;
      document.body.appendChild(tempElement);
      
      // Select the content
      const range = document.createRange();
      range.selectNodeContents(tempElement);
      
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Execute copy command
        document.execCommand("copy");
        
        // Clean up
        selection.removeAllRanges();
        document.body.removeChild(tempElement);
        
        setCopied(true);
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to copy content:", error);
      
      // Fallback to the old method if the new one fails
      try {
        await navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error("Fallback copy also failed:", fallbackError);
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!contentToCopy}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        copied
          ? "bg-green-500 text-white"
          : contentToCopy
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
      } ${className}`}
    >
      {copied ? "Copied!" : "Copy to Clipboard"}
    </button>
  );
};

export default CopyButton; 