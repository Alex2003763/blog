export interface TOCItem {
  id: string
  title: string
  level: number
  children: TOCItem[]
}

/**
 * Generate a URL-safe anchor ID from heading text
 * Handles special characters, spaces, and non-English text
 */
export function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff]/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    // Ensure it's not empty
    || 'heading'
}

/**
 * Parse markdown content and extract headings with their levels
 */
export function parseMarkdownHeadings(content: string): Array<{ level: number; title: string; id: string }> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Array<{ level: number; title: string; id: string }> = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = generateAnchorId(title)
    
    headings.push({ level, title, id })
  }

  return headings
}

/**
 * Build a hierarchical table of contents structure
 */
export function buildTOCTree(headings: Array<{ level: number; title: string; id: string }>): TOCItem[] {
  const toc: TOCItem[] = []
  const stack: TOCItem[] = []

  for (const heading of headings) {
    const item: TOCItem = {
      id: heading.id,
      title: heading.title,
      level: heading.level,
      children: []
    }

    // Find the correct parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // Top level item
      toc.push(item)
    } else {
      // Child item
      stack[stack.length - 1].children.push(item)
    }

    stack.push(item)
  }

  return toc
}

/**
 * Generate table of contents from markdown content
 */
export function generateTOC(content: string): TOCItem[] {
  const headings = parseMarkdownHeadings(content)
  return buildTOCTree(headings)
}

/**
 * Add anchor IDs to markdown headings
 */
export function addAnchorIds(content: string): string {
  return content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const id = generateAnchorId(title.trim())
    return `${hashes} ${title.trim()} {#${id}}`
  })
}

/**
 * Flatten TOC tree for easier iteration
 */
export function flattenTOC(toc: TOCItem[]): TOCItem[] {
  const flattened: TOCItem[] = []
  
  function traverse(items: TOCItem[]) {
    for (const item of items) {
      flattened.push(item)
      if (item.children.length > 0) {
        traverse(item.children)
      }
    }
  }
  
  traverse(toc)
  return flattened
}
