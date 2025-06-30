# Markdown Editor

A powerful, customizable markdown editor built for Next.js applications with TypeScript support, dark/light mode integration, and mobile-responsive design.

## Features

- 🎨 **Modern UI**: Clean, responsive design with dark/light mode support
- 📱 **Mobile Optimized**: Touch-friendly interface with proper mobile interactions
- ⌨️ **Keyboard Shortcuts**: Comprehensive keyboard shortcuts for efficient editing
- 🔧 **Highly Customizable**: Modular architecture with customizable components
- 🎯 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🌙 **Theme Integration**: Seamless integration with next-themes
- 📝 **Live Preview**: Real-time markdown preview with syntax highlighting
- 🔍 **Syntax Highlighting**: Code syntax highlighting in the editor
- 📊 **Statistics**: Word count, character count, and reading time
- ✅ **Validation**: Built-in markdown validation and error reporting
- 🎪 **Extensible**: Plugin-like command system for custom functionality

## Installation

```bash
npm install markdown-it highlight.js next-themes
```

## Basic Usage

```tsx
import { MarkdownEditor } from '@/components/markdown-editor'

export default function MyEditor() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nStart writing...')

  return (
    <MarkdownEditor
      value={markdown}
      onChange={setMarkdown}
      height="400px"
    />
  )
}
```

## Advanced Usage

### Custom Commands

```tsx
import { MarkdownEditor, Command } from '@/components/markdown-editor'

const customCommands: Command[] = [
  {
    name: 'insert-date',
    icon: <CalendarIcon />,
    execute: (api) => {
      const date = new Date().toISOString().split('T')[0]
      api.insertText(date)
    },
    keyCommand: 'ctrl+d',
  }
]

export default function CustomEditor() {
  return (
    <MarkdownEditor
      value={markdown}
      onChange={setMarkdown}
      commands={customCommands}
    />
  )
}
```

### Theme Integration

```tsx
import { MarkdownEditor, useEditorTheme } from '@/components/markdown-editor'

export default function ThemedEditor() {
  const { theme, setTheme } = useEditorTheme()

  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
      <MarkdownEditor
        value={markdown}
        onChange={setMarkdown}
      />
    </div>
  )
}
```

### Custom Components

```tsx
import { MarkdownEditor, EditorProvider } from '@/components/markdown-editor'

const CustomToolbar = ({ commands, executeCommand }) => (
  <div className="custom-toolbar">
    {commands.map(command => (
      <button key={command.name} onClick={() => executeCommand(command)}>
        {command.icon}
      </button>
    ))}
  </div>
)

export default function CustomComponentEditor() {
  return (
    <EditorProvider>
      <MarkdownEditor
        value={markdown}
        onChange={setMarkdown}
        components={{
          toolbar: CustomToolbar
        }}
      />
    </EditorProvider>
  )
}
```

## Props

### MarkdownEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | The markdown content |
| `onChange` | `(value: string) => void` | - | Callback when content changes |
| `height` | `string \| number` | `"400px"` | Editor height |
| `preview` | `"edit" \| "live" \| "preview"` | `"live"` | Preview mode |
| `toolbarBottom` | `boolean` | `false` | Show toolbar at bottom |
| `hideToolbar` | `boolean` | `false` | Hide toolbar completely |
| `commands` | `Command[]` | Default commands | Custom command set |
| `extraCommands` | `Command[]` | `[]` | Additional commands |
| `highlightEnable` | `boolean` | `true` | Enable syntax highlighting |
| `tabSize` | `number` | `2` | Tab size for indentation |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |
| `components` | `Components` | - | Custom component overrides |

### Command Interface

```typescript
interface Command {
  name: string
  icon?: React.ReactNode
  execute?: (api: TextAreaAPI, groupName?: string) => void
  keyCommand?: string
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  children?: Command[]
  groupName?: string
}
```

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Bold | `Ctrl+B` | `⌘+B` |
| Italic | `Ctrl+I` | `⌘+I` |
| Code | `Ctrl+`` | `⌘+`` |
| Link | `Ctrl+K` | `⌘+K` |
| Heading 1 | `Ctrl+1` | `⌘+1` |
| Heading 2 | `Ctrl+2` | `⌘+2` |
| Heading 3 | `Ctrl+3` | `⌘+3` |
| Unordered List | `Ctrl+Shift+8` | `⌘+⇧+8` |
| Ordered List | `Ctrl+Shift+7` | `⌘+⇧+7` |
| Quote | `Ctrl+Shift+.` | `⌘+⇧+.` |
| Preview Toggle | `Ctrl+Shift+P` | `⌘+⇧+P` |
| Fullscreen | `F11` | `F11` |

## Utilities

### Markdown Processing

```typescript
import { 
  extractFrontmatter, 
  getMarkdownStats, 
  validateMarkdownSyntax 
} from '@/components/markdown-editor'

// Extract frontmatter
const { frontmatter, content } = extractFrontmatter(markdown)

// Get statistics
const stats = getMarkdownStats(markdown)
console.log(`${stats.words} words, ${stats.readingTime} min read`)

// Validate syntax
const errors = validateMarkdownSyntax(markdown)
```

### Keyboard Shortcuts

```typescript
import { 
  matchesShortcut, 
  createShortcutHandler,
  COMMON_SHORTCUTS 
} from '@/components/markdown-editor'

// Check if event matches shortcut
if (matchesShortcut(event, 'ctrl+b')) {
  // Handle bold
}

// Create shortcut handler
const handleShortcuts = createShortcutHandler({
  'ctrl+s': () => save(),
  'ctrl+z': () => undo(),
})

document.addEventListener('keydown', handleShortcuts)
```

### Validation

```typescript
import { validateMarkdown, ValidationOptions } from '@/components/markdown-editor'

const options: ValidationOptions = {
  maxLength: 10000,
  allowHtml: false,
  checkLinks: true,
}

const errors = validateMarkdown(content, options)
```

## Styling

The editor uses CSS custom properties for theming:

```css
.markdown-editor {
  --editor-background: hsl(var(--background));
  --editor-foreground: hsl(var(--foreground));
  --editor-border: hsl(var(--border));
  /* ... more variables */
}
```

### Custom Styles

```css
/* Custom editor styles */
.my-custom-editor {
  --editor-border-radius: 1rem;
  --editor-background: #f8f9fa;
}

.my-custom-editor .toolbar {
  background: linear-gradient(to right, #667eea, #764ba2);
}
```

## Mobile Optimization

The editor is fully optimized for mobile devices:

- Touch-friendly button sizes (44px minimum)
- Responsive layout that adapts to screen size
- Proper font sizes to prevent zoom on iOS
- Optimized spacing and padding for mobile
- Swipe gestures for preview mode switching

## Accessibility

- Full keyboard navigation support
- ARIA labels and descriptions
- Screen reader compatible
- High contrast mode support
- Focus management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

Check out the example files in the `examples/` directory:

- `basic-usage.tsx` - Basic editor usage and configuration
- `advanced-usage.tsx` - Custom commands, themes, validation, and file operations

## API Reference

### Components

- `MarkdownEditor` - Main editor component
- `EditorProvider` - Context provider for editor state
- `Toolbar` - Customizable toolbar component
- `Textarea` - Editor textarea with syntax highlighting
- `MarkdownPreview` - Preview component with markdown rendering
- `DragBar` - Resizable drag bar for adjusting editor height

### Hooks

- `useEditor()` - Access editor state and dispatch
- `useEditorState()` - Access editor state only
- `useEditorDispatch()` - Access dispatch function only
- `useEditorTheme()` - Theme integration hook
- `useThemeVariables()` - Apply theme variables to container

### Utilities

- Text manipulation: `wrapText`, `insertBlock`, `toggleLinePrefix`
- Markdown processing: `extractFrontmatter`, `getMarkdownStats`, `validateMarkdownSyntax`
- Keyboard shortcuts: `matchesShortcut`, `createShortcutHandler`, `COMMON_SHORTCUTS`
- Validation: `validateMarkdown`, `validateFrontmatter`, `getValidationSummary`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
