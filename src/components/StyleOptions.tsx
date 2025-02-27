"use client";

import React from "react";

export interface StyleOptionsProps {
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
  textAlign: string;
  useGermanStyle: boolean;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (family: string) => void;
  onLineHeightChange: (height: string) => void;
  onTextAlignChange: (align: string) => void;
  onUseGermanStyleChange: (use: boolean) => void;
}

const StyleOptions: React.FC<StyleOptionsProps> = ({
  fontSize,
  fontFamily,
  lineHeight,
  textAlign,
  useGermanStyle,
  onFontSizeChange,
  onFontFamilyChange,
  onLineHeightChange,
  onTextAlignChange,
  onUseGermanStyleChange,
}) => {
  const fontSizeOptions = ["10px", "11px", "12px", "14px", "16px", "18px", "20px", "24px"];
  const fontFamilyOptions = [
    "Arial, sans-serif",
    "Times New Roman, serif",
    "Calibri, sans-serif",
    "Palatino Linotype, serif",
    "Georgia, serif",
    "Verdana, sans-serif",
  ];
  const lineHeightOptions = ["1", "1.15", "1.5", "2"];
  const textAlignOptions = ["left", "justify", "center", "right"];

  const handleGermanStyleToggle = () => {
    const newValue = !useGermanStyle;
    onUseGermanStyleChange(newValue);
    
    if (newValue) {
      // Apply German typography settings
      onFontFamilyChange("Palatino Linotype, serif");
      onFontSizeChange("11px");
      onLineHeightChange("1.5");
      onTextAlignChange("justify");
    }
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Styling Options
      </h3>
      
      {/* German Style Preset */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useGermanStyle}
            onChange={handleGermanStyleToggle}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Deutsche Formatierung verwenden
          </span>
        </label>
        {useGermanStyle && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <p>• Fließtext: Palatino Linotype, 11 Punkt</p>
            <p>• Überschriften: Calibri, 12 Punkt</p>
            <p>• Blocksatz (außer bei Aufzählungen: linksbündig)</p>
            <p>• Zeilenabstand: 1,5 Zeilen</p>
          </div>
        )}
      </div>
      
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
        
        {/* Text Align */}
        <div>
          <label 
            htmlFor="textAlign" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Text Alignment
          </label>
          <select
            id="textAlign"
            value={textAlign}
            onChange={(e) => onTextAlignChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {textAlignOptions.map((align) => (
              <option key={align} value={align}>
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StyleOptions; 