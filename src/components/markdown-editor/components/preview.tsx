'use client'

import React, { useMemo, forwardRef } from 'react'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { PreviewProps } from '../types'

// Configure markdown-it with plugins
const createMarkdownRenderer = () => {
  const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`
        } catch {}
      }
      return `<pre class="hljs"><code class="hljs">${str}</code></pre>`
    }
  })

  // Add custom rules for better rendering
  md.renderer.rules.table_open = () => '<div class="table-wrapper"><table class="table">'
  md.renderer.rules.table_close = () => '</table></div>'
  
  // Custom link rendering with security
  const defaultLinkRender = md.renderer.rules.link_open || function(tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options)
  }
  
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    
    if (hrefIndex >= 0) {
      const href = token.attrs![hrefIndex][1]
      // Add security attributes for external links
      if (href.startsWith('http')) {
        token.attrPush(['target', '_blank'])
        token.attrPush(['rel', 'noopener noreferrer'])
      }
    }
    
    return defaultLinkRender(tokens, idx, options, env, self)
  }

  return md
}

export interface MarkdownPreviewRef {
  getElement: () => HTMLDivElement | null
}

const MarkdownPreview = forwardRef<MarkdownPreviewRef, PreviewProps>(({
  source,
  className = '',
  style,
  ...props
}, ref) => {
  const previewRef = React.useRef<HTMLDivElement>(null)
  
  // Create markdown renderer instance
  const markdownRenderer = useMemo(() => createMarkdownRenderer(), [])
  
  // Render markdown to HTML
  const htmlContent = useMemo(() => {
    if (!source.trim()) {
      return '<div class="text-muted-foreground italic p-4">Nothing to preview</div>'
    }
    
    try {
      return markdownRenderer.render(source)
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return '<div class="text-destructive p-4">Error rendering markdown</div>'
    }
  }, [source, markdownRenderer])

  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    getElement: () => previewRef.current,
  }))

  const previewStyles: React.CSSProperties = {
    padding: '16px',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'hsl(var(--background))',
    color: 'hsl(var(--foreground))',
    ...style,
  }

  return (
    <div
      ref={previewRef}
      className={`markdown-preview prose prose-sm dark:prose-invert max-w-none ${className}`}
      style={previewStyles}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      {...props}
    />
  )
})

MarkdownPreview.displayName = 'MarkdownPreview'

export { MarkdownPreview }
