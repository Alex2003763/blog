import { TextState, TextRange, TextAreaAPI } from '../types'

/**
 * Insert text at a specific position in a textarea
 */
export function insertTextAtPosition(textarea: HTMLTextAreaElement, text: string, position?: number): void {
  const pos = position ?? textarea.selectionStart
  const before = textarea.value.substring(0, pos)
  const after = textarea.value.substring(pos)
  
  textarea.value = before + text + after
  textarea.selectionStart = textarea.selectionEnd = pos + text.length
  
  // Trigger change event
  const event = new Event('input', { bubbles: true })
  textarea.dispatchEvent(event)
}

/**
 * Get current state from textarea element
 */
export function getStateFromTextArea(textarea: HTMLTextAreaElement): TextState {
  return {
    selection: {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    },
    text: textarea.value,
    selectedText: textarea.value.slice(textarea.selectionStart, textarea.selectionEnd),
  }
}

/**
 * TextArea API implementation for command execution
 */
export class TextAreaAPIImpl implements TextAreaAPI {
  private textarea: HTMLTextAreaElement

  constructor(textarea: HTMLTextAreaElement) {
    this.textarea = textarea
  }

  /**
   * Replace the current selection with new text
   */
  replaceSelection(text: string): TextState {
    const start = this.textarea.selectionStart
    const end = this.textarea.selectionEnd
    const before = this.textarea.value.substring(0, start)
    const after = this.textarea.value.substring(end)
    
    this.textarea.value = before + text + after
    this.textarea.selectionStart = this.textarea.selectionEnd = start + text.length
    
    // Focus and trigger change event
    this.textarea.focus()
    const event = new Event('input', { bubbles: true })
    this.textarea.dispatchEvent(event)
    
    return this.getState()
  }

  /**
   * Set selection range
   */
  setSelectionRange(selection: TextRange): TextState {
    this.textarea.focus()
    this.textarea.selectionStart = selection.start
    this.textarea.selectionEnd = selection.end
    return this.getState()
  }

  /**
   * Insert text at specific position
   */
  insertText(text: string, position?: number): TextState {
    insertTextAtPosition(this.textarea, text, position)
    return this.getState()
  }

  /**
   * Get current state
   */
  getState(): TextState {
    return getStateFromTextArea(this.textarea)
  }
}

/**
 * Command orchestrator for handling command execution
 */
export class CommandOrchestrator {
  private textarea: HTMLTextAreaElement
  private textApi: TextAreaAPIImpl

  constructor(textarea: HTMLTextAreaElement) {
    this.textarea = textarea
    this.textApi = new TextAreaAPIImpl(textarea)
  }

  getTextApi(): TextAreaAPIImpl {
    return this.textApi
  }

  getState(): TextState | false {
    if (!this.textarea) return false
    return getStateFromTextArea(this.textarea)
  }
}

/**
 * Utility functions for text manipulation
 */

/**
 * Wrap selected text with prefix and suffix
 */
export function wrapText(state: TextState, api: TextAreaAPI, prefix: string, suffix: string = prefix): void {
  const { selectedText } = state
  const newText = `${prefix}${selectedText}${suffix}`
  api.replaceSelection(newText)
}

/**
 * Insert text at the beginning of each line
 */
export function insertAtLineStart(state: TextState, api: TextAreaAPI, prefix: string): void {
  const { selectedText } = state
  const lines = selectedText.split('\n')
  const newText = lines.map(line => `${prefix}${line}`).join('\n')
  api.replaceSelection(newText)
}

/**
 * Toggle line prefix (add if not present, remove if present)
 */
export function toggleLinePrefix(state: TextState, api: TextAreaAPI, prefix: string): void {
  const { selectedText } = state
  const lines = selectedText.split('\n')
  
  // Check if all lines start with prefix
  const allHavePrefix = lines.every(line => line.startsWith(prefix))
  
  let newText: string
  if (allHavePrefix) {
    // Remove prefix from all lines
    newText = lines.map(line => line.startsWith(prefix) ? line.slice(prefix.length) : line).join('\n')
  } else {
    // Add prefix to all lines
    newText = lines.map(line => `${prefix}${line}`).join('\n')
  }
  
  api.replaceSelection(newText)
}

/**
 * Insert text with proper line breaks
 */
export function insertBlock(state: TextState, api: TextAreaAPI, text: string): void {
  const { selection } = state
  const beforeText = state.text.substring(0, selection.start)
  const afterText = state.text.substring(selection.end)
  
  // Add line breaks if needed
  let prefix = ''
  let suffix = ''
  
  if (beforeText && !beforeText.endsWith('\n')) {
    prefix = '\n'
  }
  
  if (afterText && !afterText.startsWith('\n')) {
    suffix = '\n'
  }
  
  api.replaceSelection(`${prefix}${text}${suffix}`)
}

/**
 * Get word count statistics
 */
export function getWordCount(text: string) {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const lines = text.split('\n').length
  
  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
  }
}
