"use client";

import React, { useState } from "react";
import { saveAs } from "file-saver";
import { convertHtmlToDocx } from "@/lib/utils";

interface DownloadButtonProps {
  html: string;
  title?: string;
  className?: string;
  useGermanStyle?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  html,
  title = "Document",
  className = "",
  useGermanStyle = false,
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
        .replace(/<h([1-6])[^>]*>/g, (match, level) => {
          if (useGermanStyle) {
            return `<h${level} style="color: #000000; font-weight: bold; font-family: Calibri, sans-serif; font-size: 12px;">`;
          }
          return `<h${level} style="color: #000000; font-weight: bold;">`;
        })
        .replace(/<p[^>]*>/g, (match) => {
          if (useGermanStyle) {
            return '<p style="color: #000000; margin-bottom: 1em; font-family: Palatino Linotype, serif; font-size: 11px; text-align: justify;">';
          }
          return '<p style="color: #000000; margin-bottom: 1em;">';
        })
        .replace(/<(ul|ol)[^>]*>/g, (match, tag) => {
          if (useGermanStyle) {
            return `<${tag} style="padding-left: 20px; margin: 1em 0; text-align: left;">`;
          }
          return `<${tag} style="padding-left: 20px; margin: 1em 0;">`;
        })
        .replace(/<li[^>]*>/g, (match) => {
          if (useGermanStyle) {
            return '<li style="color: #000000; margin-bottom: 0.5em; font-family: Palatino Linotype, serif; font-size: 11px;">';
          }
          return '<li style="color: #000000; margin-bottom: 0.5em;">';
        });
      
      // Add page margin settings for German style
      const docOptions = useGermanStyle ? {
        title,
        description: "Converted from Markdown",
        pageMargins: {
          top: 1700, // ~3cm in twips
          right: 1400, // ~2.5cm in twips
          bottom: 1700, // ~3cm in twips
          left: 1700  // ~3cm in twips
        }
      } : {
        title,
        description: "Converted from Markdown"
      };
      
      // Convert HTML to DOCX
      const docxBlob = await convertHtmlToDocx(cleanedHtml, title, docOptions);
      
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