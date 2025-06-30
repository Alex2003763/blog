/**
 * Validation utilities for markdown editor
 */

export interface ValidationError {
  line: number
  column: number
  message: string
  type: 'error' | 'warning' | 'info'
  code: string
}

export interface ValidationOptions {
  maxLength?: number
  maxLines?: number
  allowHtml?: boolean
  requireFrontmatter?: boolean
  allowedTags?: string[]
  blockedWords?: string[]
  checkLinks?: boolean
  checkImages?: boolean
}

/**
 * Validate markdown content
 */
export function validateMarkdown(
  content: string, 
  options: ValidationOptions = {}
): ValidationError[] {
  const errors: ValidationError[] = []
  const lines = content.split('\n')
  
  const {
    maxLength = 50000,
    maxLines = 1000,
    allowHtml = false,
    requireFrontmatter = false,
    allowedTags = [],
    blockedWords = [],
    checkLinks = true,
    checkImages = true,
  } = options
  
  // Check content length
  if (content.length > maxLength) {
    errors.push({
      line: 1,
      column: 1,
      message: `Content exceeds maximum length of ${maxLength} characters`,
      type: 'error',
      code: 'MAX_LENGTH_EXCEEDED',
    })
  }
  
  // Check line count
  if (lines.length > maxLines) {
    errors.push({
      line: maxLines + 1,
      column: 1,
      message: `Content exceeds maximum of ${maxLines} lines`,
      type: 'error',
      code: 'MAX_LINES_EXCEEDED',
    })
  }
  
  // Check for frontmatter if required
  if (requireFrontmatter && !content.startsWith('---')) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Frontmatter is required',
      type: 'error',
      code: 'MISSING_FRONTMATTER',
    })
  }
  
  // Validate each line
  lines.forEach((line, index) => {
    const lineNumber = index + 1
    
    // Check for HTML tags if not allowed
    if (!allowHtml) {
      const htmlMatches = line.match(/<[^>]+>/g)
      if (htmlMatches) {
        htmlMatches.forEach(tag => {
          const column = line.indexOf(tag) + 1
          const tagName = tag.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/)?.[1]
          
          if (tagName && !allowedTags.includes(tagName.toLowerCase())) {
            errors.push({
              line: lineNumber,
              column,
              message: `HTML tag '${tagName}' is not allowed`,
              type: 'error',
              code: 'HTML_NOT_ALLOWED',
            })
          }
        })
      }
    }
    
    // Check for blocked words
    if (blockedWords.length > 0) {
      blockedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi')
        let match
        while ((match = regex.exec(line)) !== null) {
          errors.push({
            line: lineNumber,
            column: match.index + 1,
            message: `Blocked word '${word}' found`,
            type: 'warning',
            code: 'BLOCKED_WORD',
          })
        }
      })
    }
    
    // Check links
    if (checkLinks) {
      const linkMatches = line.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)
      for (const match of linkMatches) {
        const [, text, url] = match
        const column = match.index! + 1
        
        // Check for empty link text
        if (!text.trim()) {
          errors.push({
            line: lineNumber,
            column,
            message: 'Link has empty text',
            type: 'warning',
            code: 'EMPTY_LINK_TEXT',
          })
        }
        
        // Check for empty URL
        if (!url.trim()) {
          errors.push({
            line: lineNumber,
            column: column + text.length + 3,
            message: 'Link has empty URL',
            type: 'error',
            code: 'EMPTY_LINK_URL',
          })
        }
        
        // Check for malformed URLs
        if (url.trim() && !isValidUrl(url)) {
          errors.push({
            line: lineNumber,
            column: column + text.length + 3,
            message: 'Link URL appears to be malformed',
            type: 'warning',
            code: 'MALFORMED_URL',
          })
        }
      }
    }
    
    // Check images
    if (checkImages) {
      const imageMatches = line.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)
      for (const match of imageMatches) {
        const [, alt, src] = match
        const column = match.index! + 1
        
        // Check for empty alt text
        if (!alt.trim()) {
          errors.push({
            line: lineNumber,
            column,
            message: 'Image has empty alt text',
            type: 'warning',
            code: 'EMPTY_IMAGE_ALT',
          })
        }
        
        // Check for empty src
        if (!src.trim()) {
          errors.push({
            line: lineNumber,
            column: column + alt.length + 4,
            message: 'Image has empty source',
            type: 'error',
            code: 'EMPTY_IMAGE_SRC',
          })
        }
      }
    }
    
    // Check for unmatched code blocks
    const codeBlockMatches = line.match(/```/g)
    if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
      const column = line.indexOf('```') + 1
      errors.push({
        line: lineNumber,
        column,
        message: 'Potentially unmatched code block',
        type: 'warning',
        code: 'UNMATCHED_CODE_BLOCK',
      })
    }
    
    // Check for empty headings
    if (line.match(/^#{1,6}\s*$/)) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: 'Empty heading',
        type: 'warning',
        code: 'EMPTY_HEADING',
      })
    }
    
    // Check for excessive heading levels
    const headingMatch = line.match(/^(#{7,})\s/)
    if (headingMatch) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: 'Heading level too deep (maximum is 6)',
        type: 'error',
        code: 'HEADING_TOO_DEEP',
      })
    }
    
    // Check for trailing whitespace
    if (line.endsWith(' ') || line.endsWith('\t')) {
      errors.push({
        line: lineNumber,
        column: line.length,
        message: 'Line has trailing whitespace',
        type: 'info',
        code: 'TRAILING_WHITESPACE',
      })
    }
  })
  
  return errors
}

/**
 * Check if a URL is valid
 */
function isValidUrl(url: string): boolean {
  // Allow relative URLs
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return true
  }
  
  // Allow anchor links
  if (url.startsWith('#')) {
    return true
  }
  
  // Check absolute URLs
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate frontmatter
 */
export function validateFrontmatter(
  frontmatter: string,
  requiredFields: string[] = [],
  allowedFields: string[] = []
): ValidationError[] {
  const errors: ValidationError[] = []
  const lines = frontmatter.split('\n')
  const fields = new Set<string>()
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1
    const colonIndex = line.indexOf(':')
    
    if (line.trim() && colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      const value = line.substring(colonIndex + 1).trim()
      
      fields.add(key)
      
      // Check if field is allowed
      if (allowedFields.length > 0 && !allowedFields.includes(key)) {
        errors.push({
          line: lineNumber,
          column: 1,
          message: `Field '${key}' is not allowed`,
          type: 'warning',
          code: 'FIELD_NOT_ALLOWED',
        })
      }
      
      // Check for empty values
      if (!value) {
        errors.push({
          line: lineNumber,
          column: colonIndex + 2,
          message: `Field '${key}' has empty value`,
          type: 'warning',
          code: 'EMPTY_FIELD_VALUE',
        })
      }
    } else if (line.trim() && !line.includes(':')) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: 'Invalid frontmatter syntax',
        type: 'error',
        code: 'INVALID_FRONTMATTER_SYNTAX',
      })
    }
  })
  
  // Check for required fields
  requiredFields.forEach(field => {
    if (!fields.has(field)) {
      errors.push({
        line: 1,
        column: 1,
        message: `Required field '${field}' is missing`,
        type: 'error',
        code: 'MISSING_REQUIRED_FIELD',
      })
    }
  })
  
  return errors
}

/**
 * Get validation summary
 */
export function getValidationSummary(errors: ValidationError[]): {
  errorCount: number
  warningCount: number
  infoCount: number
  hasErrors: boolean
  hasWarnings: boolean
} {
  const errorCount = errors.filter(e => e.type === 'error').length
  const warningCount = errors.filter(e => e.type === 'warning').length
  const infoCount = errors.filter(e => e.type === 'info').length
  
  return {
    errorCount,
    warningCount,
    infoCount,
    hasErrors: errorCount > 0,
    hasWarnings: warningCount > 0,
  }
}
