import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function convertHtmlToDocx(html: string, title: string = "Document"): Promise<Blob> {
  // This is a simplified conversion - a full implementation would need to parse the HTML
  // and create appropriate docx elements for each HTML element
  
  // Create a new document
  const doc = new Document({
    title,
    description: "Converted from Markdown",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          // For simplicity, we're just adding the HTML content as a paragraph
          // In a real implementation, you would parse the HTML and create appropriate docx elements
          new Paragraph({
            children: [
              new TextRun({
                text: "This is a basic conversion. For better results, copy the HTML directly.",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            text: html.replace(/<[^>]*>/g, ""), // Remove HTML tags for basic text extraction
          }),
        ],
      },
    ],
  });

  // Generate the docx file
  return await Packer.toBlob(doc);
}
