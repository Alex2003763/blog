/**
 * Markdown processing utilities
 */

/**
 * Extract frontmatter from markdown content
 */
export function extractFrontmatter(markdown: string): {
  frontmatter: Record<string, unknown>
  content: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)
  
  if (!match) {
    return { frontmatter: {}, content: markdown }
  }
  
  const [, frontmatterStr, content] = match
  
  try {
    // Simple YAML-like parsing for basic frontmatter
    const frontmatter: Record<string, unknown> = {}
    frontmatterStr.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '')
        
        // Try to parse as number or boolean
        if (cleanValue === 'true') {
          frontmatter[key] = true
        } else if (cleanValue === 'false') {
          frontmatter[key] = false
        } else if (!isNaN(Number(cleanValue)) && cleanValue !== '') {
          frontmatter[key] = Number(cleanValue)
        } else {
          frontmatter[key] = cleanValue
        }
      }
    })
    
    return { frontmatter, content }
  } catch (error) {
    console.warn('Failed to parse frontmatter:', error)
    return { frontmatter: {}, content: markdown }
  }
}

/**
 * Add or update frontmatter in markdown content
 */
export function updateFrontmatter(
  markdown: string,
  updates: Record<string, unknown>
): string {
  const { frontmatter, content } = extractFrontmatter(markdown)
  const updatedFrontmatter = { ...frontmatter, ...updates }
  
  if (Object.keys(updatedFrontmatter).length === 0) {
    return content
  }
  
  const frontmatterStr = Object.entries(updatedFrontmatter)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}: "${value}"`
      }
      return `${key}: ${value}`
    })
    .join('\n')
  
  return `---\n${frontmatterStr}\n---\n${content}`
}

/**
 * Extract headings from markdown content
 */
export function extractHeadings(markdown: string): Array<{
  level: number
  text: string
  id: string
  line: number
}> {
  const lines = markdown.split('\n')
  const headings: Array<{ level: number; text: string; id: string; line: number }> = []
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      headings.push({
        level,
        text,
        id,
        line: index + 1,
      })
    }
  })
  
  return headings
}

/**
 * Generate table of contents from markdown
 */
export function generateTableOfContents(markdown: string): string {
  const headings = extractHeadings(markdown)
  
  if (headings.length === 0) {
    return ''
  }
  
  const toc = headings
    .map(heading => {
      const indent = '  '.repeat(heading.level - 1)
      return `${indent}- [${heading.text}](#${heading.id})`
    })
    .join('\n')
  
  return `## Table of Contents\n\n${toc}\n`
}

/**
 * Count words, characters, and other statistics
 */
export function getMarkdownStats(markdown: string): {
  words: number
  characters: number
  charactersNoSpaces: number
  paragraphs: number
  headings: number
  links: number
  images: number
  codeBlocks: number
  lists: number
  readingTime: number // in minutes
} {
  const { content } = extractFrontmatter(markdown)
  
  // Remove code blocks for word counting
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '')
  
  // Remove inline code for word counting
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]+`/g, '')
  
  // Count words (split by whitespace and filter empty strings)
  const words = withoutInlineCode
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length
  
  const characters = content.length
  const charactersNoSpaces = content.replace(/\s/g, '').length
  
  // Count paragraphs (non-empty lines that aren't headings, lists, etc.)
  const paragraphs = content
    .split('\n')
    .filter(line => {
      const trimmed = line.trim()
      return trimmed.length > 0 && 
             !trimmed.startsWith('#') && 
             !trimmed.startsWith('-') && 
             !trimmed.startsWith('*') && 
             !trimmed.startsWith('+') && 
             !trimmed.match(/^\d+\./) &&
             !trimmed.startsWith('>')
    }).length
  
  const headings = (content.match(/^#{1,6}\s+.+$/gm) || []).length
  const links = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length
  const images = (content.match(/!\[([^\]]*)\]\(([^)]+)\)/g) || []).length
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length
  const lists = (content.match(/^[\s]*[-*+]\s+/gm) || []).length + 
                (content.match(/^[\s]*\d+\.\s+/gm) || []).length
  
  // Estimate reading time (average 200 words per minute)
  const readingTime = Math.ceil(words / 200)
  
  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    headings,
    links,
    images,
    codeBlocks,
    lists,
    readingTime,
  }
}

/**
 * Validate markdown syntax and return errors
 */
export function validateMarkdown(markdown: string): Array<{
  line: number
  column: number
  message: string
  type: 'error' | 'warning'
}> {
  const errors: Array<{ line: number; column: number; message: string; type: 'error' | 'warning' }> = []
  const lines = markdown.split('\n')
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1
    
    // Check for unmatched brackets in links
    const linkMatches = line.match(/\[([^\]]*)\]/g)
    if (linkMatches) {
      linkMatches.forEach(match => {
        const column = line.indexOf(match) + 1
        if (!line.includes(`${match}(`)) {
          errors.push({
            line: lineNumber,
            column,
            message: 'Link text without URL',
            type: 'warning',
          })
        }
      })
    }
    
    // Check for unmatched code blocks
    const codeBlockMatches = line.match(/```/g)
    if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
      // This is a simple check - a more sophisticated parser would track state
      const column = line.indexOf('```') + 1
      errors.push({
        line: lineNumber,
        column,
        message: 'Potentially unmatched code block',
        type: 'warning',
      })
    }
    
    // Check for empty headings
    if (line.match(/^#{1,6}\s*$/)) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: 'Empty heading',
        type: 'warning',
      })
    }
  })
  
  return errors
}

/**
 * Clean up markdown formatting
 */
export function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace from lines
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    // Remove trailing whitespace
    .trim()
}

/**
 * Convert markdown to plain text
 */
export function markdownToPlainText(markdown: string): string {
  const { content } = extractFrontmatter(markdown)
  
  return content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    // Clean up whitespace
    .replace(/\n{2,}/g, '\n\n')
    .trim()
}
