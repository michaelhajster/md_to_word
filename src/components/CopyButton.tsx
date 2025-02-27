"use client";

import React, { useState } from "react";

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
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy content:", error);
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