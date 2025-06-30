'use client'

import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { TextareaProps } from '../types'
import { useEditor } from '../context'
import { CommandOrchestrator } from '../utils/text-api'

// Syntax highlighting for markdown
function highlightMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^(#{1,6})\s+(.*)$/gm, '<span class="text-blue-600 dark:text-blue-400 font-bold">$1</span> <span class="text-gray-900 dark:text-gray-100 font-semibold">$2</span>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-gray-900 dark:text-gray-100">**$1**</span>')
    // Italic
    .replace(/\*(.*?)\*/g, '<span class="italic text-gray-700 dark:text-gray-300">*$1*</span>')
    // Inline code
    .replace(/`([^`]+)`/g, '<span class="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 rounded font-mono text-sm">`$1`</span>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="text-blue-600 dark:text-blue-400 underline">[$1]($2)</span>')
    // Code blocks
    .replace(/^```[\s\S]*?```$/gm, '<span class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 block p-2 rounded font-mono text-sm">$&</span>')
    // Lists
    .replace(/^(\s*[-*+])\s+(.*)$/gm, '<span class="text-purple-600 dark:text-purple-400">$1</span> <span class="text-gray-900 dark:text-gray-100">$2</span>')
    .replace(/^(\s*\d+\.)\s+(.*)$/gm, '<span class="text-purple-600 dark:text-purple-400">$1</span> <span class="text-gray-900 dark:text-gray-100">$2</span>')
    // Quotes
    .replace(/^>\s+(.*)$/gm, '<span class="text-gray-600 dark:text-gray-400 border-l-4 border-gray-300 dark:border-gray-600 pl-2 italic">> $1</span>')
    // Horizontal rules
    .replace(/^---+$/gm, '<span class="text-gray-400 dark:text-gray-600">$&</span>')
}

export interface TextareaRef {
  focus: () => void
  blur: () => void
  getTextArea: () => HTMLTextAreaElement | null
}

const Textarea = forwardRef<TextareaRef, TextareaProps>(({
  value = '',
  onChange,
  onScroll,
  highlightEnable = true,
  tabSize = 2,
  defaultTabEnable = false,
  renderTextarea,
  className = '',
  style,
  ...props
}, ref) => {
  const { state, dispatch } = useEditor()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const orchestratorRef = useRef<CommandOrchestrator | null>(null)

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    getTextArea: () => textareaRef.current,
  }))

  // Initialize command orchestrator
  useEffect(() => {
    if (textareaRef.current) {
      orchestratorRef.current = new CommandOrchestrator(textareaRef.current)
      dispatch({
        textarea: textareaRef.current,
        textareaWrap: wrapRef.current || undefined,
        textareaPre: preRef.current || undefined,
      })
    }
  }, [dispatch])

  // Handle tab key behavior
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab' && !defaultTabEnable) {
      event.preventDefault()
      const textarea = event.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const spaces = ' '.repeat(tabSize)
      
      // Insert spaces
      const newValue = value.substring(0, start) + spaces + value.substring(end)
      onChange?.({ ...event, currentTarget: { ...textarea, value: newValue } } as unknown as React.ChangeEvent<HTMLTextAreaElement>)
      
      // Set cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length
      }, 0)
    }
    
    // Handle other keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      const key = event.key.toLowerCase()
      const shortcuts = state.commands.concat(state.extraCommands)
        .filter(cmd => cmd.shortcuts?.some(shortcut => 
          shortcut.toLowerCase().includes(key) && 
          ((shortcut.includes('ctrl') && event.ctrlKey) || (shortcut.includes('cmd') && event.metaKey))
        ))
      
      if (shortcuts.length > 0) {
        event.preventDefault()
        const command = shortcuts[0]
        if (command.execute && orchestratorRef.current) {
          const textApi = orchestratorRef.current.getTextApi()
          const textState = orchestratorRef.current.getState()
          if (textState) {
            command.execute(textState, textApi, dispatch)
          }
        }
      }
    }
  }, [defaultTabEnable, tabSize, value, onChange, state.commands, state.extraCommands, dispatch])

  // Sync scroll between textarea and pre
  const handleTextareaScroll = useCallback((event: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current && highlightEnable) {
      preRef.current.scrollTop = event.currentTarget.scrollTop
      preRef.current.scrollLeft = event.currentTarget.scrollLeft
    }
    onScroll?.(event)
  }, [highlightEnable, onScroll])

  // Update syntax highlighting
  const highlightedContent = highlightEnable ? highlightMarkdown(value) : ''

  // Custom textarea renderer
  if (renderTextarea) {
    return renderTextarea({
      value,
      onChange,
      onScroll: handleTextareaScroll,
      onKeyDown: handleKeyDown,
      highlightEnable,
      tabSize,
      defaultTabEnable,
      className,
      style,
      ...props,
    })
  }

  const textareaStyles: React.CSSProperties = {
    resize: 'none',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    color: highlightEnable ? 'transparent' : 'inherit',
    caretColor: 'hsl(var(--foreground))',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: window.innerWidth < 768 ? '16px' : '14px', // Prevent zoom on iOS
    lineHeight: '1.6',
    padding: window.innerWidth < 768 ? '12px' : '16px', // Smaller padding on mobile
    width: '100%',
    height: '100%',
    position: highlightEnable ? 'absolute' : 'relative',
    top: 0,
    left: 0,
    zIndex: highlightEnable ? 2 : 1,
    overflowY: 'auto', /* Allow vertical scrolling */
    overflowX: 'auto', /* Allow horizontal scrolling */
    WebkitOverflowScrolling: 'touch', /* Smooth scrolling on iOS */
    ...style,
  }

  const preStyles: React.CSSProperties = {
    margin: 0,
    padding: window.innerWidth < 768 ? '12px' : '16px', // Match textarea padding
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: window.innerWidth < 768 ? '16px' : '14px', // Match textarea font size
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflowY: 'auto', /* Allow vertical scrolling */
    overflowX: 'auto', /* Allow horizontal scrolling */
    WebkitOverflowScrolling: 'touch', /* Smooth scrolling on iOS */
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    background: 'transparent',
    color: 'hsl(var(--foreground))',
  }

  return (
    <div
      ref={wrapRef}
      className={`relative w-full h-full ${className}`}
      style={{
        position: 'relative',
        minHeight: '300px',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {highlightEnable && (
        <pre
          ref={preRef}
          style={preStyles}
          dangerouslySetInnerHTML={{ __html: highlightedContent }}
          aria-hidden="true"
        />
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onScroll={handleTextareaScroll}
        onKeyDown={handleKeyDown}
        style={textareaStyles}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-gramm="false"
        {...props}
      />
    </div>
  )
})

Textarea.displayName = 'Textarea'

export { Textarea }
