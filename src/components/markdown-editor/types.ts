import { ReactElement, CSSProperties, HTMLAttributes, TextareaHTMLAttributes } from 'react'

// Core editor state and selection types
export interface TextRange {
  start: number
  end: number
}

export interface TextState {
  text: string
  selectedText: string
  selection: TextRange
}

// Command system types
export interface CommandExecuteState {
  markdown?: string
  preview?: PreviewMode
  fullscreen?: boolean
  height?: CSSProperties['height']
}

export interface TextAreaAPI {
  replaceSelection: (text: string) => TextState
  setSelectionRange: (selection: TextRange) => TextState
  insertText: (text: string, position?: number) => TextState
  getState: () => TextState
}

export interface CommandContext {
  close: () => void
  execute: () => void
  getState: () => TextState | false
  textApi: TextAreaAPI
}

export interface Command {
  name: string
  keyCommand?: string
  shortcuts?: string[]
  groupName?: string
  icon?: ReactElement
  value?: string
  position?: 'left' | 'right'
  buttonProps?: HTMLAttributes<HTMLButtonElement>
  render?: (
    command: Command,
    disabled: boolean,
    executeCommand: (command: Command, groupName?: string) => void,
    index: number
  ) => ReactElement | null | undefined
  execute?: (
    state: TextState,
    api: TextAreaAPI,
    dispatch?: (action: Partial<EditorState>) => void,
    executeState?: CommandExecuteState,
    shortcuts?: string[]
  ) => void
  children?: Command[] | ((context: CommandContext) => ReactElement)
}

// Editor state and configuration
export type PreviewMode = 'edit' | 'preview' | 'live'

export interface EditorState {
  markdown?: string // Changed to optional string
  preview: PreviewMode
  fullscreen: boolean
  height: CSSProperties['height']
  highlightEnable: boolean
  tabSize: number
  defaultTabEnable: boolean
  scrollTop: number
  scrollTopPreview: number
  commands: Command[]
  extraCommands: Command[]
  barPopup: Record<string, boolean>
  container?: HTMLDivElement | null
  textarea?: HTMLTextAreaElement
  textareaWrap?: HTMLDivElement
  textareaPre?: HTMLPreElement
}

// Component props
export interface MarkdownEditorProps {
  value?: string
  onChange?: (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: EditorState) => void
  onHeightChange?: (value?: CSSProperties['height'], oldValue?: CSSProperties['height'], state?: EditorState) => void
  
  // Editor configuration
  height?: CSSProperties['height']
  minHeight?: number
  maxHeight?: number
  autoFocus?: boolean
  preview?: PreviewMode
  fullscreen?: boolean
  overflow?: boolean
  visibleDragbar?: boolean
  hideToolbar?: boolean
  toolbarBottom?: boolean
  enableScroll?: boolean
  
  // Text editing
  highlightEnable?: boolean
  tabSize?: number
  defaultTabEnable?: boolean
  
  // Commands and customization
  commands?: Command[]
  extraCommands?: Command[]
  commandsFilter?: (command: Command, isExtra: boolean) => Command | false
  
  // Styling and theming
  className?: string
  'data-color-mode'?: 'light' | 'dark' | 'auto'
  
  // Component overrides
  components?: {
    textarea?: (props: TextareaProps) => ReactElement
    toolbar?: (command: Command, disabled: boolean, executeCommand: (command: Command, groupName?: string) => void, index: number) => ReactElement | null | undefined
    preview?: (source: string, state: EditorState, dispatch: (action: Partial<EditorState>) => void) => ReactElement
  }
  
  // Textarea props
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
  
  // Preview options
  previewOptions?: {
    className?: string
    style?: CSSProperties
    components?: Record<string, unknown>
    rehypePlugins?: unknown[]
    remarkPlugins?: unknown[]
  }
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onScroll?: (event: React.UIEvent<HTMLTextAreaElement>) => void
  highlightEnable?: boolean
  tabSize?: number
  defaultTabEnable?: boolean
  renderTextarea?: (props: TextareaProps) => ReactElement
}

export interface ToolbarProps {
  commands: Command[]
  extraCommands: Command[]
  state: EditorState
  dispatch: (action: Partial<EditorState>) => void
  executeCommand: (command: Command, groupName?: string) => void
  className?: string
  overflow?: boolean
  toolbarBottom?: boolean
}

export interface PreviewProps {
  source: string
  className?: string
  style?: CSSProperties
  components?: Record<string, unknown>
  rehypePlugins?: unknown[]
  remarkPlugins?: unknown[]
}

export interface DragBarProps {
  height: number
  minHeight: number
  maxHeight: number
  onChange: (height: number) => void
  className?: string
}

// Utility types
export type EditorAction = Partial<EditorState>
export type EditorDispatch = (action: EditorAction) => void
export type CommandsFilter = (command: Command, isExtra: boolean) => Command | false
export type EditorComponents = {
  textarea?: (props: TextareaProps) => ReactElement
  toolbar?: (command: Command, disabled: boolean, executeCommand: (command: Command, groupName?: string) => void, index: number) => ReactElement | null | undefined
  preview?: (source: string, state: EditorState, dispatch: (action: Partial<EditorState>) => void) => ReactElement
}
