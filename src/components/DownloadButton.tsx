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
        // Ensure proper styling for headings
        .replace(/<h([1-6])[^>]*>/g, (match, level) => {
          if (useGermanStyle) {
            return `<h${level} style="color: #000000; font-weight: bold; font-family: Calibri, sans-serif; font-size: 12pt;">`;
          }
          return `<h${level} style="color: #000000; font-weight: bold;">`;
        })
        // Ensure proper styling for paragraphs
        .replace(/<p[^>]*>/g, (match) => {
          if (useGermanStyle) {
            return '<p style="color: #000000; margin-bottom: 1em; font-family: Palatino Linotype, serif; font-size: 11pt; text-align: justify;">';
          }
          return '<p style="color: #000000; margin-bottom: 1em;">';
        })
        // Ensure proper styling for lists
        .replace(/<(ul|ol)[^>]*>/g, (match, tag) => {
          if (useGermanStyle) {
            return `<${tag} style="padding-left: 20px; margin: 1em 0; text-align: left;">`;
          }
          return `<${tag} style="padding-left: 20px; margin: 1em 0;">`;
        })
        // Ensure proper styling for list items
        .replace(/<li[^>]*>/g, (match) => {
          if (useGermanStyle) {
            return '<li style="color: #000000; margin-bottom: 0.5em; font-family: Palatino Linotype, serif; font-size: 11pt;">';
          }
          return '<li style="color: #000000; margin-bottom: 0.5em;">';
        })
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
        })
        // Handle horizontal rules
        .replace(/<hr[^>]*>/g, '<hr style="border: none; border-top: 1px solid #999; margin: 2em 0;">');
      
      // Add page margin settings for German style
      const docOptions = useGermanStyle ? {
        title,
        description: "Academic Document",
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
      
      // Save the file with a more academic-friendly filename
      const filename = useGermanStyle 
        ? `${title.replace(/[^a-z0-9äöüß]/gi, "-").toLowerCase()}.docx`
        : `${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.docx`;
      
      saveAs(docxBlob, filename);
      
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