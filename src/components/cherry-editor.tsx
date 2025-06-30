'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full p-4 border border-input bg-background text-foreground rounded-md animate-pulse min-h-[400px] flex items-center justify-center">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }
)

interface CherryEditorProps {
  value?: string
  onChange?: (value: string) => void
  minHeight?: string
  placeholder?: string
}

export function CherryEditor({
  value = '',
  onChange,
  minHeight = '500px',
  placeholder = 'Start writing your amazing content...'
}: CherryEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state during SSR
  if (!mounted) {
    return (
      <div
        className="w-full p-4 border border-input bg-background text-foreground rounded-md animate-pulse flex items-center justify-center"
        style={{ minHeight }}
      >
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }



  try {
    return (
      <div
        className="w-full md-editor-wrapper"
        style={{ minHeight }}
        data-color-mode="auto"
      >
        <MDEditor
          value={value}
          onChange={(val) => onChange?.(val || '')}
          preview="live"
          hideToolbar={false}
          visibleDragbar={false}
          height={parseInt(minHeight)}
          textareaProps={{
            placeholder,
            style: {
              fontSize: 15,
              lineHeight: 1.7,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              color: 'inherit',
              padding: '16px'
            }
          }}
          style={{
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            minHeight: minHeight,
            width: '100%'
          }}
        />
      </div>
    )
  } catch (error) {
    console.error('Error rendering MDEditor:', error)
    return (
      <div className="w-full p-4 border border-input bg-background text-foreground rounded-md">
        <div className="text-red-500 mb-2">Error loading editor</div>
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full bg-transparent border-0 outline-0 resize-none text-foreground"
          style={{ minHeight: `calc(${minHeight} - 2rem)` }}
        />
      </div>
    )
  }
}
