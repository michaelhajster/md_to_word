"use client";

import React, { useState } from "react";
import { prepareHtmlForClipboard } from "@/lib/utils";

interface CopyButtonProps {
  contentToCopy: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  contentToCopy,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!contentToCopy) return;

    try {
      // Process the HTML for better Word compatibility
      const processedHtml = prepareHtmlForClipboard(contentToCopy);
      
      // Create a temporary element to hold the HTML
      const tempElement = document.createElement("div");
      tempElement.innerHTML = processedHtml;
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