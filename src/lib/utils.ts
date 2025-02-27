import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to convert HTML to a format better suited for Word pasting
export function prepareHtmlForClipboard(html: string, useGermanStyle: boolean = false): string {
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
  
  // Process blockquotes for conclusions
  const blockquotes = tempDiv.querySelectorAll('blockquote');
  blockquotes.forEach(blockquote => {
    // Check if this is a conclusion blockquote
    const firstParagraph = blockquote.querySelector('p');
    if (firstParagraph && firstParagraph.textContent?.includes('Conclusion')) {
      blockquote.style.borderLeft = '3px solid #666';
      blockquote.style.paddingLeft = '10px';
      blockquote.style.fontStyle = 'italic';
    }
  });
  
  // Ensure text is black for Word
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.color = '#000000';
      
      // Remove any background colors
      el.style.backgroundColor = 'transparent';
      
      // Apply German style if requested
      if (useGermanStyle) {
        // Set default font to Palatino Linotype, 11pt
        el.style.fontFamily = 'Palatino Linotype, serif';
        el.style.fontSize = '11pt';
        el.style.lineHeight = '1.5';
        
        // Set text alignment to justify except for lists and blockquotes
        if (!['UL', 'OL', 'LI', 'BLOCKQUOTE'].includes(el.tagName)) {
          el.style.textAlign = 'justify';
        } else if (el.tagName === 'BLOCKQUOTE') {
          // Special handling for blockquotes in German style
          el.style.fontStyle = 'italic';
          el.style.marginLeft = '1cm';
          el.style.paddingLeft = '0.5cm';
          el.style.borderLeft = '3px solid #666';
        } else {
          el.style.textAlign = 'left';
        }
        
        // Set headings to Calibri, 12pt
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
          el.style.fontFamily = 'Calibri, sans-serif';
          el.style.fontSize = '12pt';
          el.style.fontWeight = 'bold';
        }
        
        // Set footnotes to 10pt
        if (el.classList.contains('footnote')) {
          el.style.fontSize = '10pt';
        }
      } else {
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
    }
  });
  
  // Return the processed HTML
  return tempDiv.innerHTML;
}

export async function convertHtmlToDocx(
  html: string, 
  title: string = "Document", 
  options: {
    description?: string;
    pageMargins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    }
  } = {}
): Promise<Blob> {
  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  // Default options
  const docOptions = {
    title,
    description: options.description || "Converted from Markdown",
    sections: [
      {
        properties: options.pageMargins ? {
          page: {
            margin: {
              top: options.pageMargins.top,
              right: options.pageMargins.right,
              bottom: options.pageMargins.bottom,
              left: options.pageMargins.left,
            }
          }
        } : {},
        children: parseHtmlToDocxElements(doc.body, title),
      },
    ],
  };

  // Create a new document
  const docxDoc = new Document(docOptions);

  // Generate the docx file
  return await Packer.toBlob(docxDoc);
}

function parseHtmlToDocxElements(element: HTMLElement, title: string): any[] {
  const elements: any[] = [];
  
  // Skip adding title if the document already has section headings
  const hasHeadings = element.querySelectorAll('h1, h2, h3').length > 0;
  
  if (!hasHeadings) {
    // Add title only if there are no headings
    elements.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      })
    );
  }
  
  // Process child nodes recursively
  processNodes(element.childNodes, elements);
  
  return elements;
}

// Helper function to process nodes recursively
function processNodes(nodes: NodeListOf<ChildNode> | ArrayLike<ChildNode>, elements: any[]): void {
  Array.from(nodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Only add non-empty text nodes
      if (node.textContent?.trim()) {
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: node.textContent.trim() })],
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
              spacing: {
                before: 240, // 12pt before
                after: 120,  // 6pt after
              }
            })
          );
          break;
        case "h2":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 240, // 12pt before
                after: 120,  // 6pt after
              }
            })
          );
          break;
        case "h3":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
              heading: HeadingLevel.HEADING_3,
              spacing: {
                before: 200, // 10pt before
                after: 100,  // 5pt after
              }
            })
          );
          break;
        case "h4":
          elements.push(
            new Paragraph({
              text: el.textContent || "",
              heading: HeadingLevel.HEADING_4,
              spacing: {
                before: 160, // 8pt before
                after: 80,   // 4pt after
              }
            })
          );
          break;
        case "p":
          // Check if this paragraph is inside a blockquote
          const isInBlockquote = el.closest('blockquote') !== null;
          const isConclusionParagraph = el.textContent?.includes('Conclusion') || false;
          
          elements.push(
            new Paragraph({
              children: [new TextRun({ 
                text: el.textContent || "",
                italics: isInBlockquote || isConclusionParagraph
              })],
              indent: isInBlockquote ? { left: 720 } : undefined, // 0.5 inch indent for blockquote paragraphs
              border: isInBlockquote ? {
                left: {
                  color: "888888",
                  space: 10,
                  style: BorderStyle.SINGLE,
                  size: 10,
                }
              } : undefined,
              spacing: {
                before: 120, // 6pt before
                after: 120,  // 6pt after
              }
            })
          );
          break;
        case "ul":
        case "ol":
          // Process list items
          Array.from(el.children).forEach((li, index) => {
            elements.push(
              new Paragraph({
                text: `${tagName === "ol" ? `${index + 1}.` : "•"} ${li.textContent || ""}`,
                indent: { left: 720 }, // 0.5 inch indent
                spacing: {
                  before: 80,  // 4pt before
                  after: 80,   // 4pt after
                }
              })
            );
          });
          break;
        case "blockquote":
          // Check if this is a conclusion blockquote
          const firstP = el.querySelector('p');
          const isConclusion = firstP && firstP.textContent ? firstP.textContent.includes('Conclusion') : false;
          
          // Process each paragraph in the blockquote
          const paragraphs = el.querySelectorAll('p');
          paragraphs.forEach(p => {
            elements.push(
              new Paragraph({
                children: [new TextRun({ 
                  text: p.textContent || "",
                  italics: true,
                  bold: isConclusion && p.textContent ? p.textContent.includes('Conclusion') : false
                })],
                indent: { left: 720 }, // 0.5 inch indent
                border: {
                  left: {
                    color: "888888",
                    space: 10,
                    style: BorderStyle.SINGLE,
                    size: 10,
                  }
                },
                spacing: {
                  before: 120, // 6pt before
                  after: 120,  // 6pt after
                }
              })
            );
          });
          break;
        case "hr":
          // Add a horizontal rule
          elements.push(
            new Paragraph({
              text: "───────────────────────────────────────",
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 240, // 12pt before
                after: 240,  // 12pt after
              }
            })
          );
          break;
        case "strong":
        case "b":
          // Bold text
          elements.push(
            new Paragraph({
              children: [new TextRun({ 
                text: el.textContent || "",
                bold: true
              })]
            })
          );
          break;
        case "em":
        case "i":
          // Italic text
          elements.push(
            new Paragraph({
              children: [new TextRun({ 
                text: el.textContent || "",
                italics: true
              })]
            })
          );
          break;
        case "div":
          // Process div children recursively
          processNodes(el.childNodes, elements);
          break;
        default:
          // For other elements, just add their text content
          if (el.textContent?.trim()) {
            elements.push(
              new Paragraph({
                text: el.textContent.trim(),
              })
            );
          }
          break;
      }
    }
  });
}
