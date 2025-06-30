'use client'

import React, { useState, useCallback } from 'react'
import { 
  MarkdownEditor, 
  Command, 
  useEditorTheme,
  getMarkdownStats,
  validateMarkdown,
  ValidationOptions
} from '../index'
import {
  Calendar,
  Clock,
  FileText,
  Hash,
  Save,
  Upload,
  Download
} from 'lucide-react'

/**
 * Advanced example with custom commands
 */
export function CustomCommandsExample() {
  const [markdown, setMarkdown] = useState('# Custom Commands Example\n\nTry the custom commands in the toolbar!')
  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])

  const customCommands: Command[] = [
    {
      name: 'insert-date',
      icon: <Calendar className="w-4 h-4" />,
      execute: (_state, api) => {
        const date = new Date().toLocaleDateString()
        api.replaceSelection(date)
      },
      keyCommand: 'ctrl+shift+d',
      buttonProps: {
        title: 'Insert current date (Ctrl+Shift+D)',
      },
    },
    {
      name: 'insert-time',
      icon: <Clock className="w-4 h-4" />,
      execute: (_state, api) => {
        const time = new Date().toLocaleTimeString()
        api.replaceSelection(time)
      },
      keyCommand: 'ctrl+shift+t',
      buttonProps: {
        title: 'Insert current time (Ctrl+Shift+T)',
      },
    },
    {
      name: 'word-count',
      icon: <FileText className="w-4 h-4" />,
      execute: (state) => {
        const stats = getMarkdownStats(state.text)
        alert(`Words: ${stats.words}\nCharacters: ${stats.characters}\nReading time: ${stats.readingTime} min`)
      },
      buttonProps: {
        title: 'Show word count and statistics',
      },
    },
    {
      name: 'insert-toc',
      icon: <Hash className="w-4 h-4" />,
      execute: (state, api) => {
        const { text } = state
        const headings = text.match(/^#{1,6}\s+.+$/gm) || []
        
        if (headings.length === 0) {
          alert('No headings found to generate table of contents')
          return
        }
        
        const toc = headings
          .map(heading => {
            const level = heading.match(/^#+/)?.[0].length || 1
            const text = heading.replace(/^#+\s+/, '')
            const indent = '  '.repeat(level - 1)
            const anchor = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            return `${indent}- [${text}](#${anchor})`
          })
          .join('\n')
        
        api.insertText(`## Table of Contents\n\n${toc}\n\n`)
      },
      buttonProps: {
        title: 'Generate table of contents',
      },
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Custom Commands Example</h2>
      
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Custom Commands:</h3>
        <ul className="text-sm space-y-1">
          <li>📅 Insert Date (Ctrl+Shift+D)</li>
          <li>🕐 Insert Time (Ctrl+Shift+T)</li>
          <li>📊 Word Count</li>
          <li>📋 Generate Table of Contents</li>
        </ul>
      </div>

      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="500px"
        extraCommands={customCommands}
      />
    </div>
  )
}

/**
 * Example with theme integration
 */
export function ThemeIntegrationExample() {
  const [markdown, setMarkdown] = useState('# Theme Integration\n\nThis editor integrates with the app theme system.')
  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])
  const { theme, setTheme, resolvedTheme } = useEditorTheme()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Theme Integration Example</h2>
      
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTheme('light')}
          className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          Dark
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
        >
          System
        </button>
        <span className="px-3 py-1 text-sm text-muted-foreground">
          Current: {resolvedTheme}
        </span>
      </div>

      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="400px"
      />
    </div>
  )
}

/**
 * Example with validation
 */
export function ValidationExample() {
  const [markdown, setMarkdown] = useState(`# Validation Example

This content has some issues:

- [Empty link]()
- ![Missing alt text](image.jpg)
- <script>alert('html not allowed')</script>

Try adding more content to see validation in action.`)
  
  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])

  const validationOptions: ValidationOptions = {
    maxLength: 1000,
    allowHtml: false,
    checkLinks: true,
    checkImages: true,
    blockedWords: ['spam', 'advertisement'],
  }

  const errors = validateMarkdown(markdown, validationOptions)
  const errorCount = errors.filter(e => e.type === 'error').length
  const warningCount = errors.filter(e => e.type === 'warning').length

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Validation Example</h2>
      
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Validation Status:</h3>
        <div className="flex gap-4 text-sm">
          <span className={errorCount > 0 ? 'text-destructive' : 'text-green-600'}>
            Errors: {errorCount}
          </span>
          <span className={warningCount > 0 ? 'text-yellow-600' : 'text-green-600'}>
            Warnings: {warningCount}
          </span>
        </div>
        
        {errors.length > 0 && (
          <div className="mt-2 space-y-1">
            {errors.slice(0, 5).map((error, index) => (
              <div key={index} className="text-xs">
                <span className={`font-medium ${
                  error.type === 'error' ? 'text-destructive' : 'text-yellow-600'
                }`}>
                  Line {error.line}:
                </span>
                <span className="ml-1">{error.message}</span>
              </div>
            ))}
            {errors.length > 5 && (
              <div className="text-xs text-muted-foreground">
                ... and {errors.length - 5} more issues
              </div>
            )}
          </div>
        )}
      </div>

      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="400px"
      />
    </div>
  )
}

/**
 * Example with file operations
 */
export function FileOperationsExample() {
  const [markdown, setMarkdown] = useState('# File Operations\n\nTry saving and loading files!')
  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) {
      setMarkdown(value)
    }
  }, [setMarkdown])

  const handleSave = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [markdown])

  const handleLoad = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.txt'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setMarkdown(content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }, [])

  const fileCommands: Command[] = [
    {
      name: 'save-file',
      icon: <Save className="w-4 h-4" />,
      execute: handleSave,
      keyCommand: 'ctrl+s',
      buttonProps: {
        title: 'Save file (Ctrl+S)',
      },
    },
    {
      name: 'load-file',
      icon: <Upload className="w-4 h-4" />,
      execute: handleLoad,
      buttonProps: {
        title: 'Load file',
      },
    },
    {
      name: 'export-html',
      icon: <Download className="w-4 h-4" />,
      execute: () => {
        // This would require markdown-it to be imported
        alert('HTML export would be implemented here')
      },
      buttonProps: {
        title: 'Export as HTML',
      },
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">File Operations Example</h2>
      
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">File Operations:</h3>
        <ul className="text-sm space-y-1">
          <li>💾 Save as Markdown (Ctrl+S)</li>
          <li>📁 Load from file</li>
          <li>📄 Export as HTML</li>
        </ul>
      </div>

      <MarkdownEditor
        value={markdown}
        onChange={handleChange}
        height="400px"
        extraCommands={fileCommands}
      />
    </div>
  )
}
