import { Command } from '../types'
import { wrapText, insertBlock, toggleLinePrefix } from '../utils/text-api'

// Heading commands
export const h1: Command = {
  name: 'h1',
  keyCommand: 'h1',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 12h8m-8-6v12m8-12v12M17 7v10M21 7v10" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Heading 1', title: 'Heading 1' },
  execute: (state, api) => {
    const text = state.selectedText || 'Heading 1'
    api.replaceSelection(`# ${text}`)
  },
}

export const h2: Command = {
  name: 'h2',
  keyCommand: 'h2',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 12h8m-8-6v12m8-12v12M17 7h4l-4 5h4v3h-4" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Heading 2', title: 'Heading 2' },
  execute: (state, api) => {
    const text = state.selectedText || 'Heading 2'
    api.replaceSelection(`## ${text}`)
  },
}

export const h3: Command = {
  name: 'h3',
  keyCommand: 'h3',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 12h8m-8-6v12m8-12v12M17 7h4l-2 3 2 3h-4" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Heading 3', title: 'Heading 3' },
  execute: (state, api) => {
    const text = state.selectedText || 'Heading 3'
    api.replaceSelection(`### ${text}`)
  },
}

// Heading group command
export const headingGroup: Command = {
  name: 'heading',
  keyCommand: 'heading',
  groupName: 'heading',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 12h12M6 20V4M18 20V4" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Headings', title: 'Headings' },
  children: [h1, h2, h3],
}

// Basic formatting commands
export const bold: Command = {
  name: 'bold',
  keyCommand: 'bold',
  shortcuts: ['ctrl+b', 'cmd+b'],
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Bold', title: 'Bold (Ctrl+B)' },
  execute: (state, api) => {
    wrapText(state, api, '**')
  },
}

export const italic: Command = {
  name: 'italic',
  keyCommand: 'italic',
  shortcuts: ['ctrl+i', 'cmd+i'],
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M19 4h-9M14 20H5M15 4L9 20" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Italic', title: 'Italic (Ctrl+I)' },
  execute: (state, api) => {
    wrapText(state, api, '*')
  },
}

export const strikethrough: Command = {
  name: 'strikethrough',
  keyCommand: 'strikethrough',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Strikethrough', title: 'Strikethrough' },
  execute: (state, api) => {
    wrapText(state, api, '~~')
  },
}

export const code: Command = {
  name: 'code',
  keyCommand: 'code',
  shortcuts: ['ctrl+`', 'cmd+`'],
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Inline code', title: 'Inline code (Ctrl+`)' },
  execute: (state, api) => {
    wrapText(state, api, '`')
  },
}

export const codeBlock: Command = {
  name: 'codeBlock',
  keyCommand: 'codeBlock',
  shortcuts: ['ctrl+shift+c', 'cmd+shift+c'],
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <polyline points="8,12 12,16 16,12" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Code block', title: 'Code block (Ctrl+Shift+C)' },
  execute: (state, api) => {
    const codeBlockText = state.selectedText || 'code'
    insertBlock(state, api, `\`\`\`\n${codeBlockText}\n\`\`\``)
  },
}

// Link and image commands
export const link: Command = {
  name: 'link',
  keyCommand: 'link',
  shortcuts: ['ctrl+k', 'cmd+k'],
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Link', title: 'Link (Ctrl+K)' },
  execute: (state, api) => {
    const linkText = state.selectedText || 'link text'
    api.replaceSelection(`[${linkText}](url)`)
  },
}

export const image: Command = {
  name: 'image',
  keyCommand: 'image',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Image', title: 'Image' },
  execute: (state, api) => {
    const altText = state.selectedText || 'alt text'
    api.replaceSelection(`![${altText}](image-url)`)
  },
}

// List commands
export const unorderedList: Command = {
  name: 'unorderedList',
  keyCommand: 'unorderedList',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Unordered list', title: 'Unordered list' },
  execute: (state, api) => {
    if (state.selectedText) {
      toggleLinePrefix(state, api, '- ')
    } else {
      api.replaceSelection('- ')
    }
  },
}

export const orderedList: Command = {
  name: 'orderedList',
  keyCommand: 'orderedList',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Ordered list', title: 'Ordered list' },
  execute: (state, api) => {
    if (state.selectedText) {
      const lines = state.selectedText.split('\n')
      const newText = lines.map((line, index) => `${index + 1}. ${line}`).join('\n')
      api.replaceSelection(newText)
    } else {
      api.replaceSelection('1. ')
    }
  },
}

export const checkedList: Command = {
  name: 'checkedList',
  keyCommand: 'checkedList',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="9,11 12,14 22,4" />
      <path d="M21,12v7a2,2 0,0 1,-2,2H5a2,2 0,0 1,-2,-2V5a2,2 0,0 1,2,-2h11" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Task list', title: 'Task list' },
  execute: (state, api) => {
    if (state.selectedText) {
      toggleLinePrefix(state, api, '- [ ] ')
    } else {
      api.replaceSelection('- [ ] ')
    }
  },
}

// Quote and divider
export const quote: Command = {
  name: 'quote',
  keyCommand: 'quote',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Quote', title: 'Quote' },
  execute: (state, api) => {
    if (state.selectedText) {
      toggleLinePrefix(state, api, '> ')
    } else {
      api.replaceSelection('> ')
    }
  },
}

export const hr: Command = {
  name: 'hr',
  keyCommand: 'hr',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Horizontal rule', title: 'Horizontal rule' },
  execute: (state, api) => {
    insertBlock(state, api, '---')
  },
}

// Divider (visual separator in toolbar)
export const divider: Command = {
  name: 'divider',
  keyCommand: 'divider',
  render: () => (
    <div className="w-px h-6 bg-border mx-1" role="separator" aria-orientation="vertical" />
  ),
}

// Preview mode commands
export const editMode: Command = {
  name: 'edit',
  keyCommand: 'edit',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Edit mode', title: 'Edit mode' },
  execute: (_state, _api, dispatch) => {
    dispatch?.({ preview: 'edit' })
  },
}

export const previewMode: Command = {
  name: 'preview',
  keyCommand: 'preview',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Preview mode', title: 'Preview mode' },
  execute: (_state, _api, dispatch) => {
    dispatch?.({ preview: 'preview' })
  },
}

export const liveMode: Command = {
  name: 'live',
  keyCommand: 'live',
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Live mode', title: 'Live mode' },
  execute: (_state, _api, dispatch) => {
    dispatch?.({ preview: 'live' })
  },
}

export const fullscreen: Command = {
  name: 'fullscreen',
  keyCommand: 'fullscreen',
  shortcuts: ['F11'],
  icon: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  ),
  buttonProps: { 'aria-label': 'Fullscreen', title: 'Fullscreen (F11)' },
  execute: (_state, _api, dispatch, executeState) => {
    dispatch?.({ fullscreen: !executeState?.fullscreen })
  },
}

// Get default commands
export function getDefaultCommands(): Command[] {
  return [
    bold,
    italic,
    strikethrough,
    divider,
    headingGroup,
    divider,
    code,
    codeBlock,
    divider,
    link,
    image,
    divider,
    unorderedList,
    orderedList,
    checkedList,
    divider,
    quote,
    hr,
  ]
}

// Get default extra commands (right side of toolbar)
export function getDefaultExtraCommands(): Command[] {
  return [
    editMode,
    liveMode,
    previewMode,
    divider,
    fullscreen,
  ]
}
