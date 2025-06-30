'use client'

import dynamic from 'next/dynamic'
import '@uiw/react-markdown-preview/markdown.css'

// Dynamically import MDEditor.Markdown to avoid SSR issues
const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then(mod => ({ default: mod.default.Markdown })),
  { ssr: false }
)

interface MarkdownContentProps {
  content: string
  className?: string
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <>
     
      <div 
        className={`prose prose-base sm:prose-lg max-w-none dark:prose-invert markdown-renderer ${className}`} 
        data-color-mode="auto"
      >
        <MDPreview
          source={content}
          style={{
            whiteSpace: 'wrap',
            backgroundColor: 'transparent',
            color: 'inherit'
          }}
        />
      </div>
    </>
  )
}
