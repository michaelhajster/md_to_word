"use client";

import React from "react";

export interface StyleOptionsProps {
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (family: string) => void;
  onLineHeightChange: (height: string) => void;
}

const StyleOptions: React.FC<StyleOptionsProps> = ({
  fontSize,
  fontFamily,
  lineHeight,
  onFontSizeChange,
  onFontFamilyChange,
  onLineHeightChange,
}) => {
  const fontSizeOptions = ["12px", "14px", "16px", "18px", "20px", "24px"];
  const fontFamilyOptions = [
    "Arial, sans-serif",
    "Times New Roman, serif",
    "Calibri, sans-serif",
    "Georgia, serif",
    "Verdana, sans-serif",
  ];
  const lineHeightOptions = ["1", "1.15", "1.5", "2"];

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Styling Options
      </h3>
      
      <div className="space-y-4">
        {/* Font Size */}
        <div>
          <label 
            htmlFor="fontSize" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Font Size
          </label>
          <select
            id="fontSize"
            value={fontSize}
            onChange={(e) => onFontSizeChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {fontSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        
        {/* Font Family */}
        <div>
          <label 
            htmlFor="fontFamily" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Font Family
          </label>
          <select
            id="fontFamily"
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {fontFamilyOptions.map((family) => (
              <option key={family} value={family}>
                {family.split(",")[0]}
              </option>
            ))}
          </select>
        </div>
        
        {/* Line Height */}
        <div>
          <label 
            htmlFor="lineHeight" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Line Height
          </label>
          <select
            id="lineHeight"
            value={lineHeight}
            onChange={(e) => onLineHeightChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {lineHeightOptions.map((height) => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StyleOptions; 