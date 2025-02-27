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
  
  // Process links - preserve useful links but remove chatgpt URLs
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    // Keep the link text but remove the href attribute if it's a chatgpt URL
    if (link.href && link.href.includes('chatgpt.com')) {
      const span = document.createElement('span');
      span.textContent = link.textContent;
      span.style.fontWeight = link.style.fontWeight || 'inherit';
      link.parentNode?.replaceChild(span, link);
    } else {
      // For other links, ensure they have proper styling
      link.style.color = '#0366d6';
      link.style.textDecoration = 'underline';
    }
  });
  
  // Process blockquotes for conclusions
  const blockquotes = tempDiv.querySelectorAll('blockquote');
  blockquotes.forEach(blockquote => {
    // Check if this is a conclusion blockquote
    const firstParagraph = blockquote.querySelector('p');
    if (firstParagraph && firstParagraph.textContent?.toLowerCase().includes('conclusion')) {
      blockquote.style.borderLeft = '3px solid #666';
      blockquote.style.paddingLeft = '1em';
      blockquote.style.margin = '1em 0';
      blockquote.style.fontStyle = 'italic';
      
      // Make "Conclusion" text bold
      if (firstParagraph.textContent) {
        const conclusionText = firstParagraph.textContent;
        const conclusionIndex = conclusionText.toLowerCase().indexOf('conclusion');
        if (conclusionIndex !== -1) {
          const beforeText = conclusionText.substring(0, conclusionIndex);
          const conclusionWord = conclusionText.substring(conclusionIndex, conclusionIndex + 10); // "Conclusion"
          const afterText = conclusionText.substring(conclusionIndex + 10);
          
          firstParagraph.innerHTML = '';
          if (beforeText) firstParagraph.appendChild(document.createTextNode(beforeText));
          const boldConclusion = document.createElement('strong');
          boldConclusion.textContent = conclusionWord;
          firstParagraph.appendChild(boldConclusion);
          if (afterText) firstParagraph.appendChild(document.createTextNode(afterText));
        }
      }
    } else {
      // Style for regular blockquotes
      blockquote.style.borderLeft = '3px solid #666';
      blockquote.style.paddingLeft = '1em';
      blockquote.style.margin = '1em 0';
      if (useGermanStyle) {
        blockquote.style.fontStyle = 'italic';
      }
    }
  });
  
  // Process headings to ensure proper hierarchy and styling
  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    if (heading instanceof HTMLElement) {
      // Ensure headings have proper margins
      heading.style.marginTop = '1.2em';
      heading.style.marginBottom = '0.8em';
      heading.style.fontWeight = 'bold';
      heading.style.color = '#000000';
      heading.style.lineHeight = '1.2';
      
      if (useGermanStyle) {
        heading.style.fontFamily = 'Calibri, sans-serif';
        heading.style.fontSize = '12pt';
      } else {
        // Set appropriate font sizes based on heading level
        const level = parseInt(heading.tagName.substring(1));
        const sizes = ['1.8em', '1.5em', '1.3em', '1.2em', '1.1em', '1em'];
        heading.style.fontSize = sizes[level - 1] || '1em';
      }
    }
  });
  
  // Process paragraphs for proper spacing and alignment
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(paragraph => {
    if (paragraph instanceof HTMLElement) {
      paragraph.style.marginTop = '0.8em';
      paragraph.style.marginBottom = '0.8em';
      paragraph.style.color = '#000000';
      
      // Check if paragraph is in a blockquote
      const isInBlockquote = paragraph.closest('blockquote') !== null;
      
      if (useGermanStyle) {
        paragraph.style.fontFamily = 'Palatino Linotype, serif';
        paragraph.style.fontSize = '11pt';
        paragraph.style.lineHeight = '1.5';
        
        // Apply justified text except for blockquotes
        if (!isInBlockquote) {
          paragraph.style.textAlign = 'justify';
        }
      }
      
      // If paragraph contains a citation or reference in brackets, style it appropriately
      if (paragraph.textContent && /\([^)]+\d{4}[^)]*\)/.test(paragraph.textContent)) {
        // This is likely a citation - ensure it's properly formatted
        paragraph.innerHTML = paragraph.innerHTML.replace(
          /\(([^)]+\d{4}[^)]*)\)/g, 
          '<span style="font-size: 0.95em;">($1)</span>'
        );
      }
    }
  });
  
  // Process lists for proper indentation and bullet/numbering
  const lists = tempDiv.querySelectorAll('ul, ol');
  lists.forEach(list => {
    if (list instanceof HTMLElement) {
      list.style.paddingLeft = '2em';
      list.style.marginTop = '0.8em';
      list.style.marginBottom = '0.8em';
      list.style.textAlign = 'left'; // Lists are always left-aligned
      
      // Process list items
      const items = list.querySelectorAll('li');
      items.forEach(item => {
        if (item instanceof HTMLElement) {
          item.style.marginBottom = '0.3em';
          item.style.color = '#000000';
          
          // Style paragraphs within list items
          const itemParagraphs = item.querySelectorAll('p');
          itemParagraphs.forEach(p => {
            if (p instanceof HTMLElement) {
              p.style.marginTop = '0.3em';
              p.style.marginBottom = '0.3em';
            }
          });
          
          if (useGermanStyle) {
            item.style.fontFamily = 'Palatino Linotype, serif';
            item.style.fontSize = '11pt';
            item.style.lineHeight = '1.5';
          }
        }
      });
    }
  });
  
  // Process code blocks and inline code
  const codeBlocks = tempDiv.querySelectorAll('pre');
  codeBlocks.forEach(codeBlock => {
    if (codeBlock instanceof HTMLElement) {
      codeBlock.style.fontFamily = 'Consolas, Monaco, "Courier New", monospace';
      codeBlock.style.fontSize = '0.9em';
      codeBlock.style.backgroundColor = '#f5f5f5';
      codeBlock.style.padding = '1em';
      codeBlock.style.borderRadius = '4px';
      codeBlock.style.overflow = 'auto';
      codeBlock.style.whiteSpace = 'pre';
      codeBlock.style.margin = '1em 0';
    }
  });
  
  // Process inline code
  const inlineCodes = tempDiv.querySelectorAll('code:not(pre code)');
  inlineCodes.forEach(code => {
    if (code instanceof HTMLElement) {
      code.style.fontFamily = 'Consolas, Monaco, "Courier New", monospace';
      code.style.fontSize = '0.9em';
      code.style.backgroundColor = '#f5f5f5';
      code.style.padding = '0.2em 0.4em';
      code.style.borderRadius = '3px';
    }
  });
  
  // Process tables for proper borders and spacing
  const tables = tempDiv.querySelectorAll('table');
  tables.forEach(table => {
    if (table instanceof HTMLElement) {
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.marginTop = '1em';
      table.style.marginBottom = '1em';
      
      // Process table headers and cells
      const cells = table.querySelectorAll('th, td');
      cells.forEach(cell => {
        if (cell instanceof HTMLElement) {
          cell.style.border = '1px solid #ddd';
          cell.style.padding = '8px';
          
          if (cell.tagName === 'TH') {
            cell.style.backgroundColor = '#f2f2f2';
            cell.style.fontWeight = 'bold';
          }
          
          if (useGermanStyle) {
            cell.style.fontFamily = 'Palatino Linotype, serif';
            cell.style.fontSize = '11pt';
          }
        }
      });
    }
  });
  
  // Process horizontal rules
  const hrs = tempDiv.querySelectorAll('hr');
  hrs.forEach(hr => {
    if (hr instanceof HTMLElement) {
      hr.style.border = 'none';
      hr.style.borderTop = '1px solid #999';
      hr.style.margin = '2em 0';
    }
  });
  
  // Process images
  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => {
    if (img instanceof HTMLElement) {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.margin = '1em 0';
    }
  });
  
  // Apply global styles to all elements
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      // Ensure text is black for Word
      el.style.color = el.style.color || '#000000';
      
      // Remove any background colors unless explicitly set above
      if (!el.style.backgroundColor || el.style.backgroundColor === 'transparent') {
        el.style.backgroundColor = 'transparent';
      }
      
      // Apply German style if requested (for elements not handled above)
      if (useGermanStyle && !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE', 'TABLE', 'TH', 'TD'].includes(el.tagName)) {
        el.style.fontFamily = el.style.fontFamily || 'Palatino Linotype, serif';
        el.style.fontSize = el.style.fontSize || '11pt';
        el.style.lineHeight = el.style.lineHeight || '1.5';
        
        // Set text alignment to justify except for specific elements
        if (!['UL', 'OL', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE'].includes(el.tagName)) {
          el.style.textAlign = el.style.textAlign || 'justify';
        }
      }
    }
  });
  
  // Add a wrapper div with specific styles that Word recognizes well
  const wordFriendlyWrapper = document.createElement('div');
  wordFriendlyWrapper.style.fontFamily = useGermanStyle ? 'Palatino Linotype, serif' : 'Arial, sans-serif';
  wordFriendlyWrapper.style.fontSize = useGermanStyle ? '11pt' : '12pt';
  wordFriendlyWrapper.style.lineHeight = useGermanStyle ? '1.5' : '1.2';
  wordFriendlyWrapper.style.color = '#000000';
  wordFriendlyWrapper.style.width = '100%';
  wordFriendlyWrapper.style.wordWrap = 'break-word';
  
  // Add a class for Word to recognize this as a specific content type
  wordFriendlyWrapper.className = 'WordSection1';
  wordFriendlyWrapper.innerHTML = tempDiv.innerHTML;
  
  // Return the processed HTML
  return wordFriendlyWrapper.outerHTML;
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
