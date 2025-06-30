// Main editor component
export { MarkdownEditor } from './markdown-editor'
export type { MarkdownEditorRef } from './markdown-editor'

// Context and hooks
export { EditorProvider, useEditor, useEditorState, useEditorDispatch } from './context'
export { useEditorTheme, useThemeVariables } from './hooks/use-theme'
export type { EditorTheme } from './hooks/use-theme'

// Components
export { Textarea } from './components/textarea'
export type { TextareaRef } from './components/textarea'
export { Toolbar } from './components/toolbar'
export { MarkdownPreview } from './components/preview'
export type { MarkdownPreviewRef } from './components/preview'
export { DragBar } from './components/drag-bar'

// Commands
export * from './commands/index'

// Types
export type {
  MarkdownEditorProps,
  EditorState,
  EditorAction,
  Command,
  TextState,
  TextRange,
  TextAreaAPI,
  ToolbarProps,
  PreviewProps,
  DragBarProps,
  TextareaProps,
  CommandContext,
  CommandsFilter,
  EditorComponents,
} from './types'

// Utilities
export {
  CommandOrchestrator,
  TextAreaAPIImpl,
  wrapText,
  insertBlock,
  toggleLinePrefix,
  insertTextAtPosition,
  getStateFromTextArea,
  getWordCount,
} from './utils/text-api'

export {
  extractFrontmatter,
  updateFrontmatter,
  extractHeadings,
  generateTableOfContents,
  getMarkdownStats,
  validateMarkdown as validateMarkdownSyntax,
  cleanMarkdown,
  markdownToPlainText,
} from './utils/markdown'

export {
  parseShortcut,
  matchesShortcut,
  getShortcutDescription,
  createShortcutHandler,
  getPrimaryShortcut,
  shouldReceiveShortcuts,
  addGlobalShortcuts,
  formatShortcutForTooltip,
  COMMON_SHORTCUTS,
} from './utils/keyboard'
export type { KeyboardShortcut } from './utils/keyboard'

export {
  validateMarkdown,
  validateFrontmatter,
  getValidationSummary,
} from './utils/validation'
export type { ValidationError, ValidationOptions } from './utils/validation'

// Default exports for convenience
export { getDefaultCommands, getDefaultExtraCommands } from './commands'
