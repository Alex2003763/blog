'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import '@uiw/react-markdown-preview/markdown.css'

// Dynamically import MDEditor.Markdown to avoid SSR issues
const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then(mod => ({ default: mod.default.Markdown })),
  { ssr: false }
)

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state during SSR or fallback to simple rendering
  if (!mounted) {
    const renderContent = (text: string) => {
      return text
        .split('\n')
        .map((line, index) => (
          <div key={index} className="mb-2">
            {line || <br />}
          </div>
        ))
    }

    return (
      <div className={`markdown-renderer ${className}`}>
        <div className="prose prose-lg max-w-none dark:prose-invert text-foreground">
          {renderContent(content)}
        </div>
      </div>
    )
  }

  return (
    <div className={`markdown-renderer ${className}`} data-color-mode="auto">
      <MDPreview
        source={content}
        style={{
          whiteSpace: 'pre-wrap',
          backgroundColor: 'transparent',
          color: 'inherit'
        }}
      />
    </div>
  )
}
