import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert HTML to a format better suited for Word pasting
export function prepareHtmlForClipboard(html: string): string {
  // Create a temporary DOM element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Process links - remove external URLs that aren't useful in Word
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    // Keep the link text but remove the href attribute if it's a chatgpt URL
    if (link.href && link.href.includes('chatgpt.com')) {
      const span = document.createElement('span');
      span.textContent = link.textContent;
      span.style.fontWeight = link.style.fontWeight || 'inherit';
      link.parentNode?.replaceChild(span, link);
    }
  });
  
  // Ensure text is black for Word
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.color = '#000000';
      
      // Remove any background colors
      el.style.backgroundColor = 'transparent';
      
      // Ensure proper spacing
      if (el.tagName === 'P') {
        el.style.marginBottom = '1em';
      }
      
      // Improve heading styles
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
        el.style.fontWeight = 'bold';
        el.style.marginTop = '1em';
        el.style.marginBottom = '0.5em';
      }
    }
  });
  
  // Return the processed HTML
  return tempDiv.innerHTML;
}

export async function convertHtmlToDocx(html: string, title: string = "Document"): Promise<Blob> {
  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  // Create a new document
  const docxDoc = new Document({
    title,
    description: "Converted from Markdown",
    sections: [
      {
        properties: {},
        children: parseHtmlToDocxElements(doc.body, title),
      },
    ],
  });

  // Generate the docx file
  return await Packer.toBlob(docxDoc);
}

function parseHtmlToDocxElements(element: HTMLElement, title: string): any[] {
  const elements: any[] = [];
  
  // Add title
  elements.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    })
  );
  
  // Process child nodes
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent?.trim()) {
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: node.textContent })],
          })
        );
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      
      switch (tagName) {
        case "h1":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
              heading: HeadingLevel.HEADING_1,
            })
          );
          break;
        case "h2":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
              heading: HeadingLevel.HEADING_2,
            })
          );
          break;
        case "h3":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
              heading: HeadingLevel.HEADING_3,
            })
          );
          break;
        case "p":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
            })
          );
          break;
        case "ul":
        case "ol":
          Array.from(el.children).forEach((li, index) => {
            elements.push(
              new Paragraph({
                text: `${tagName === "ol" ? `${index + 1}.` : "•"} ${li.textContent || ""}`,
                indent: { left: 720 }, // 0.5 inch indent
              })
            );
          });
          break;
        case "blockquote":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
              indent: { left: 720 },
              border: {
                left: {
                  color: "888888",
                  space: 10,
                  style: "single",
                  size: 10,
                }
              }
            })
          );
          break;
        default:
          // For other elements, just add their text content
          if (el.textContent?.trim()) {
            elements.push(
              new Paragraph({
                text: el.textContent,
              })
            );
          }
          break;
      }
    }
  });
  
  return elements;
}
