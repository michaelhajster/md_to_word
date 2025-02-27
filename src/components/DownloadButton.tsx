"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import { convertHtmlToDocx } from "@/lib/utils";

interface DownloadButtonProps {
  html: string;
  title?: string;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  html,
  title = "Document",
  className = "",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!html || isDownloading) return;

    try {
      setIsDownloading(true);
      
      // Clean the HTML before conversion
      const cleanedHtml = html
        // Remove chatgpt links
        .replace(/<a\s+href="https:\/\/chatgpt\.com[^"]*"[^>]*>(.*?)<\/a>/g, '$1')
        // Ensure proper styling
        .replace(/<h([1-6])[^>]*>/g, (match, level) => `<h${level} style="color: #000000; font-weight: bold;">`)
        .replace(/<p[^>]*>/g, '<p style="color: #000000; margin-bottom: 1em;">')
        .replace(/<(ul|ol)[^>]*>/g, '<$1 style="padding-left: 20px; margin: 1em 0;">')
        .replace(/<li[^>]*>/g, '<li style="color: #000000; margin-bottom: 0.5em;">');
      
      // Convert HTML to DOCX
      const docxBlob = await convertHtmlToDocx(cleanedHtml, title);
      
      // Save the file
      saveAs(docxBlob, `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.docx`);
      
      setIsDownloading(false);
    } catch (error) {
      console.error("Failed to download DOCX:", error);
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!html || isDownloading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isDownloading
          ? "bg-yellow-500 text-white"
          : html
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
      } ${className}`}
    >
      {isDownloading ? "Downloading..." : "Download as DOCX"}
    </button>
  );
};

export default DownloadButton; 