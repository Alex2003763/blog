'use client'

import React, { useState, useCallback } from 'react'
import { MarkdownEditor } from '../index'

/**
 * Basic usage example of the Markdown Editor
 */
export default function BasicUsageExample() {
  const [markdown, setMarkdown] = useState(`# Welcome to the Markdown Editor

This is a **basic example** of how to use the markdown editor.

## Features

- Live preview
- Syntax highlighting
- Mobile responsive
- Dark/light mode support

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!")
}
\`\`\`

> This is a blockquote with some *italic* text.

### Lists

1. First item
2. Second item
3. Third item

- Bullet point
- Another bullet
- Last bullet

### Links and Images

[Visit our website](https://example.com)

![Sample Image](https://via.placeholder.com/300x200)

---

Happy writing! ✨`)

  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Basic Markdown Editor Example</h1>
      
      <div className="mb-4">
        <p className="text-muted-foreground">
          This example shows the basic usage of the markdown editor with default settings.
        </p>
      </div>

      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="600px"
        autoFocus
      />

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Content Statistics:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Characters:</span> {markdown.length}
          </div>
          <div>
            <span className="font-medium">Words:</span> {markdown.split(/\s+/).filter(w => w.length > 0).length}
          </div>
          <div>
            <span className="font-medium">Lines:</span> {markdown.split('\n').length}
          </div>
          <div>
            <span className="font-medium">Paragraphs:</span> {markdown.split('\n\n').filter(p => p.trim().length > 0).length}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Example with custom height and preview mode
 */
export function CustomHeightExample() {
  const [markdown, setMarkdown] = useState('# Custom Height Example\n\nThis editor has a custom height of 300px.')
  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])
  const [preview, setPreview] = useState<'edit' | 'live' | 'preview'>('live')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Custom Height & Preview Mode</h2>
      
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setPreview('edit')}
          className={`px-3 py-1 rounded ${preview === 'edit' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          Edit Only
        </button>
        <button
          onClick={() => setPreview('live')}
          className={`px-3 py-1 rounded ${preview === 'live' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          Live Preview
        </button>
        <button
          onClick={() => setPreview('preview')}
          className={`px-3 py-1 rounded ${preview === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          Preview Only
        </button>
      </div>

      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="600px"
        preview={preview}
      />
    </div>
  )
}

/**
 * Example with toolbar at bottom
 */
export function BottomToolbarExample() {
  const [markdown, setMarkdown] = useState('# Bottom Toolbar\n\nThis editor has the toolbar at the bottom.')

  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Bottom Toolbar Example</h2>
      
      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="400px"
        toolbarBottom
      />
    </div>
  )
}

/**
 * Example without toolbar
 */
export function NoToolbarExample() {
  const [markdown, setMarkdown] = useState('# No Toolbar\n\nThis editor has no toolbar. Use keyboard shortcuts for formatting.')

  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">No Toolbar Example</h2>
      
      <p className="text-muted-foreground mb-4">
        This editor has no toolbar. Use keyboard shortcuts like Ctrl+B for bold, Ctrl+I for italic, etc.
      </p>

      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="400px"
        hideToolbar
      />
    </div>
  )
}

/**
 * Example with disabled syntax highlighting
 */
export function NoHighlightingExample() {
  const [markdown, setMarkdown] = useState('# No Syntax Highlighting\n\nThis editor has syntax highlighting disabled.')

  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">No Syntax Highlighting</h2>
      
      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="400px"
        highlightEnable={false}
      />
    </div>
  )
}
