/**
 * Keyboard shortcut utilities
 */

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
}

/**
 * Parse a keyboard shortcut string into components
 * Examples: "ctrl+b", "cmd+shift+k", "F11"
 */
export function parseShortcut(shortcut: string): KeyboardShortcut {
  const parts = shortcut.toLowerCase().split('+')
  const result: KeyboardShortcut = {
    key: parts[parts.length - 1],
  }
  
  parts.slice(0, -1).forEach(modifier => {
    switch (modifier) {
      case 'ctrl':
        result.ctrl = true
        break
      case 'cmd':
      case 'meta':
        result.meta = true
        break
      case 'shift':
        result.shift = true
        break
      case 'alt':
        result.alt = true
        break
    }
  })
  
  return result
}

/**
 * Check if a keyboard event matches a shortcut
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parsed = parseShortcut(shortcut)
  
  // Normalize key names
  const eventKey = event.key.toLowerCase()
  const shortcutKey = parsed.key.toLowerCase()
  
  // Check key match
  const keyMatches = eventKey === shortcutKey || 
                    (shortcutKey === 'space' && eventKey === ' ') ||
                    (shortcutKey === 'enter' && eventKey === 'enter') ||
                    (shortcutKey === 'tab' && eventKey === 'tab') ||
                    (shortcutKey === 'escape' && eventKey === 'escape')
  
  if (!keyMatches) return false
  
  // Check modifiers
  const ctrlMatches = !!parsed.ctrl === event.ctrlKey
  const metaMatches = !!parsed.meta === event.metaKey
  const shiftMatches = !!parsed.shift === event.shiftKey
  const altMatches = !!parsed.alt === event.altKey
  
  return ctrlMatches && metaMatches && shiftMatches && altMatches
}

/**
 * Get a human-readable description of a shortcut
 */
export function getShortcutDescription(shortcut: string): string {
  const parsed = parseShortcut(shortcut)
  const parts: string[] = []
  
  // Detect platform
  const isMac = typeof navigator !== 'undefined' && 
               navigator.platform.toUpperCase().indexOf('MAC') >= 0
  
  if (parsed.ctrl) {
    parts.push(isMac ? '⌃' : 'Ctrl')
  }
  
  if (parsed.meta) {
    parts.push(isMac ? '⌘' : 'Win')
  }
  
  if (parsed.alt) {
    parts.push(isMac ? '⌥' : 'Alt')
  }
  
  if (parsed.shift) {
    parts.push(isMac ? '⇧' : 'Shift')
  }
  
  // Capitalize and format key
  let key = parsed.key
  if (key.length === 1) {
    key = key.toUpperCase()
  } else {
    key = key.charAt(0).toUpperCase() + key.slice(1)
  }
  
  parts.push(key)
  
  return parts.join(isMac ? '' : '+')
}

/**
 * Create a keyboard shortcut handler
 */
export function createShortcutHandler(
  shortcuts: Record<string, () => void>
): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent) => {
    for (const [shortcut, handler] of Object.entries(shortcuts)) {
      if (matchesShortcut(event, shortcut)) {
        event.preventDefault()
        handler()
        break
      }
    }
  }
}

/**
 * Common keyboard shortcuts for markdown editing
 */
export const COMMON_SHORTCUTS = {
  BOLD: ['ctrl+b', 'cmd+b'],
  ITALIC: ['ctrl+i', 'cmd+i'],
  UNDERLINE: ['ctrl+u', 'cmd+u'],
  STRIKETHROUGH: ['ctrl+shift+x', 'cmd+shift+x'],
  CODE: ['ctrl+`', 'cmd+`'],
  CODE_BLOCK: ['ctrl+shift+c', 'cmd+shift+c'],
  LINK: ['ctrl+k', 'cmd+k'],
  IMAGE: ['ctrl+shift+i', 'cmd+shift+i'],
  HEADING_1: ['ctrl+1', 'cmd+1'],
  HEADING_2: ['ctrl+2', 'cmd+2'],
  HEADING_3: ['ctrl+3', 'cmd+3'],
  UNORDERED_LIST: ['ctrl+shift+8', 'cmd+shift+8'],
  ORDERED_LIST: ['ctrl+shift+7', 'cmd+shift+7'],
  QUOTE: ['ctrl+shift+.', 'cmd+shift+.'],
  HORIZONTAL_RULE: ['ctrl+shift+-', 'cmd+shift+-'],
  SAVE: ['ctrl+s', 'cmd+s'],
  UNDO: ['ctrl+z', 'cmd+z'],
  REDO: ['ctrl+y', 'cmd+y', 'ctrl+shift+z', 'cmd+shift+z'],
  FIND: ['ctrl+f', 'cmd+f'],
  REPLACE: ['ctrl+h', 'cmd+h'],
  FULLSCREEN: ['F11'],
  PREVIEW: ['ctrl+shift+p', 'cmd+shift+p'],
  LIVE_PREVIEW: ['ctrl+shift+l', 'cmd+shift+l'],
} as const

/**
 * Get the primary shortcut for the current platform
 */
export function getPrimaryShortcut(shortcuts: readonly string[]): string {
  const isMac = typeof navigator !== 'undefined' && 
               navigator.platform.toUpperCase().indexOf('MAC') >= 0
  
  // Find the first shortcut that matches the platform
  for (const shortcut of shortcuts) {
    const hasCmd = shortcut.includes('cmd')
    const hasCtrl = shortcut.includes('ctrl')
    
    if (isMac && hasCmd) return shortcut
    if (!isMac && hasCtrl) return shortcut
  }
  
  // Fallback to first shortcut
  return shortcuts[0]
}

/**
 * Check if an element should receive keyboard shortcuts
 */
export function shouldReceiveShortcuts(element: Element): boolean {
  const tagName = element.tagName.toLowerCase()
  
  // Don't handle shortcuts in form inputs (except our editor)
  if (['input', 'select', 'option'].includes(tagName)) {
    return false
  }
  
  // Don't handle shortcuts in contenteditable elements (except our editor)
  if (element.getAttribute('contenteditable') === 'true') {
    return false
  }
  
  // Allow shortcuts in our markdown editor textarea
  if (element.closest('.markdown-editor')) {
    return true
  }
  
  // Don't handle shortcuts in other textareas
  if (tagName === 'textarea') {
    return false
  }
  
  return true
}

/**
 * Add global keyboard shortcut listeners
 */
export function addGlobalShortcuts(
  shortcuts: Record<string, () => void>,
  options: {
    preventDefault?: boolean
    checkTarget?: boolean
  } = {}
): () => void {
  const { preventDefault = true, checkTarget = true } = options
  
  const handler = (event: KeyboardEvent) => {
    // Check if the target should receive shortcuts
    if (checkTarget && event.target && !shouldReceiveShortcuts(event.target as Element)) {
      return
    }
    
    for (const [shortcut, callback] of Object.entries(shortcuts)) {
      if (matchesShortcut(event, shortcut)) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback()
        break
      }
    }
  }
  
  document.addEventListener('keydown', handler)
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handler)
  }
}

/**
 * Format shortcut for display in tooltips
 */
export function formatShortcutForTooltip(shortcuts: readonly string[]): string {
  const primary = getPrimaryShortcut(shortcuts)
  return getShortcutDescription(primary)
}
