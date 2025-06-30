'use client'

import React, { useEffect, useRef, useCallback, useImperativeHandle, forwardRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MarkdownEditorProps, EditorState, Command } from './types'
import { EditorProvider, useEditor, closeAllPopups } from './context'
import { Textarea, TextareaRef } from './components/textarea'
import { Toolbar } from './components/toolbar'
import { MarkdownPreview, MarkdownPreviewRef } from './components/preview'
import { DragBar } from './components/drag-bar'
import { CommandOrchestrator } from './utils/text-api'
import { useThemeVariables } from './hooks/use-theme'

export interface MarkdownEditorRef {
  focus: () => void
  blur: () => void
  getState: () => EditorState
  getTextArea: () => HTMLTextAreaElement | null
}

// Internal editor component that uses context
const InternalMarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(({
  value = '',
  onChange,
  onHeightChange,
  height = 400,
  minHeight = 400,
  maxHeight = 1000,
  autoFocus = false,
  preview = 'live',
  fullscreen = false,
  overflow = true,
  visibleDragbar = true,
  hideToolbar = false,
  toolbarBottom = false,
  enableScroll = true,
  highlightEnable = true,
  tabSize = 2,
  defaultTabEnable = false,
  commands,
  extraCommands,
  commandsFilter,
  className = '',
  'data-color-mode': dataColorMode = 'auto',
  components,
  textareaProps,
  previewOptions,
  ...props
}, ref) => {
  const { state, dispatch } = useEditor()
  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<TextareaRef>(null)
  const previewRef = useRef<MarkdownPreviewRef>(null)
  const orchestratorRef = useRef<CommandOrchestrator | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Destructure value from textareaProps to avoid type conflict
  const { value: textareaValue, ...restTextareaProps } = textareaProps || {};
  // Suppress unused variable warning since this is intentionally extracted to avoid conflicts
  void textareaValue;

  // Theme integration
  const { resolvedTheme } = useThemeVariables(containerRef as React.RefObject<HTMLElement>)

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
    getState: () => state,
    getTextArea: () => textareaRef.current?.getTextArea() || null,
  }))

  // Initialize editor state
  useEffect(() => {
    dispatch({
      markdown: value,
      preview,
      fullscreen,
      height,
      highlightEnable,
      tabSize,
      defaultTabEnable,
      commands: commands || state.commands,
      extraCommands: extraCommands || state.extraCommands,
      container: containerRef.current,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount - intentionally ignoring dependencies

  // Update state when props change
  useEffect(() => {
    if (value !== state.markdown) {
      dispatch({ markdown: value })
    }
  }, [value, state.markdown, dispatch])

  useEffect(() => {
    if (preview !== state.preview) {
      dispatch({ preview })
    }
  }, [preview, state.preview, dispatch])

  useEffect(() => {
    if (fullscreen !== state.fullscreen) {
      dispatch({ fullscreen })
    }
  }, [fullscreen, state.fullscreen, dispatch])

  // Handle browser fullscreen API
  useEffect(() => {
    if (typeof window === 'undefined') return; // Ensure this runs only on the client

    const container = containerRef.current;
    if (!container) return;

    // Check if Fullscreen API is supported
    const doc = document as Document & {
      fullscreenEnabled?: boolean;
      webkitFullscreenEnabled?: boolean;
      mozFullScreenEnabled?: boolean;
      msFullscreenEnabled?: boolean;
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };
    const fullscreenEnabled = doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled;

    if (!fullscreenEnabled) {
      console.warn('Fullscreen API is not supported in this browser');
      return;
    }

    // Get the appropriate fullscreen element property
    const getFullscreenElement = () => {
      return doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;
    };

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      const isFullscreen = Boolean(getFullscreenElement());
      if (isFullscreen !== state.fullscreen) {
        dispatch({ fullscreen: isFullscreen });
      }
    };

    // Add event listeners for all browser variants
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Handle fullscreen state changes
    if (state.fullscreen) {
      document.body.style.overflow = 'hidden'; // Prevent body scroll when fullscreen
      if (!getFullscreenElement()) {
        // Request fullscreen with fallbacks
        const containerElement = container as HTMLElement & {
          webkitRequestFullscreen?: () => Promise<void>;
          mozRequestFullScreen?: () => Promise<void>;
          msRequestFullscreen?: () => Promise<void>;
        };
        const requestFullscreen = containerElement.requestFullscreen ||
          containerElement.webkitRequestFullscreen ||
          containerElement.mozRequestFullScreen ||
          containerElement.msRequestFullscreen;

        requestFullscreen.call(container).catch((err: Error) => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
          dispatch({ fullscreen: false });
        });
      }
    } else {
      document.body.style.overflow = ''; // Restore body scroll
      if (getFullscreenElement()) {
        // Exit fullscreen with fallbacks
        const exitFullscreen = doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;

        exitFullscreen.call(document).catch((err: Error) => {
          console.error(`Error attempting to exit fullscreen mode: ${err.message}`);
          dispatch({ fullscreen: true });
        });
      }
    }

    // Cleanup event listeners and body overflow
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.body.style.overflow = ''; // Ensure body overflow is reset on unmount
    };
  }, [state.fullscreen, dispatch]);

  useEffect(() => {
    if (height !== state.height) {
      dispatch({ height })
      onHeightChange?.(height, state.height, state)
    }
  }, [height, state.height, dispatch, onHeightChange, state])

  // Handle textarea change
  const handleTextareaChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value
    dispatch({ markdown: newValue })
    onChange?.(newValue, event, state)
    textareaProps?.onChange?.(event)
  }, [onChange, state, textareaProps, dispatch])

  // Execute command
  const executeCommand = useCallback((command: Command) => {
    if (!command.execute) return
    
    const textarea = textareaRef.current?.getTextArea()
    if (!textarea) return

    if (!orchestratorRef.current) {
      orchestratorRef.current = new CommandOrchestrator(textarea)
    }

    const textApi = orchestratorRef.current.getTextApi()
    const textState = orchestratorRef.current.getState()
    
    if (textState) {
      command.execute(textState, textApi, dispatch, {
        markdown: state.markdown,
        preview: state.preview,
        fullscreen: state.fullscreen,
        height: state.height,
      })
    }
  }, [state, dispatch])

  // Handle container click to close popups
  const handleContainerClick = useCallback(() => {
    dispatch({ barPopup: closeAllPopups(state.barPopup) })
  }, [state.barPopup, dispatch])

  // Handle scroll synchronization
  const handleTextareaScroll = useCallback((event: React.UIEvent<HTMLTextAreaElement>) => {
    if (!enableScroll) return
    
    const textarea = event.currentTarget
    const previewElement = previewRef.current?.getElement()
    
    if (previewElement && textarea) {
      const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight)
      const previewScrollTop = scrollPercentage * (previewElement.scrollHeight - previewElement.clientHeight)
      previewElement.scrollTop = previewScrollTop
    }
  }, [enableScroll])



  // Handle drag bar change
  const handleDragBarChange = useCallback((newHeight: number) => {
    dispatch({ height: newHeight })
    onHeightChange?.(newHeight, state.height, state)
  }, [dispatch, onHeightChange, state])

  // Filter commands if needed
  const filteredCommands = commands || state.commands.filter(cmd => 
    commandsFilter ? commandsFilter(cmd, false) !== false : true
  )
  const filteredExtraCommands = extraCommands || state.extraCommands.filter(cmd => 
    commandsFilter ? commandsFilter(cmd, true) !== false : true
  )

  // Container classes
  const containerClasses = [
    'markdown-editor',
    'border border-border rounded-lg overflow-hidden',
    'bg-background text-foreground',
    'flex flex-col',
    'w-full', /* Removed max-w-[90%] and mx-auto to allow full width */
    state.fullscreen ? 'fixed inset-0 z-50 fullscreen' : 'relative',
    state.preview === 'edit' ? 'editor-only' : '',
    state.preview === 'preview' ? 'preview-only' : '',
    state.preview === 'live' ? 'editor-live' : '',
    // Mobile optimizations
    'sm:rounded-lg', // Only rounded on small screens and up
    className,
  ].filter(Boolean).join(' ')

  const editorHeight = typeof state.height === 'number' ? `${state.height}px` : state.height

  const editorMarkup = (
    <div
      ref={containerRef}
      className={containerClasses}
      style={state.fullscreen ? {} : { minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }} /* Use min/max height for flexibility */
      data-color-mode={dataColorMode || 'auto'}
      data-theme={resolvedTheme}
      onClick={handleContainerClick}
      {...props}
    >
      {/* Toolbar */}
      {!hideToolbar && !toolbarBottom && (
        <>
          <Toolbar
            commands={filteredCommands}
            extraCommands={filteredExtraCommands}
            executeCommand={executeCommand}
            overflow={overflow}
            toolbarBottom={false}
            state={state}
            dispatch={dispatch}
          />
          {/* Hidden text for SSR hydration */}
          <div style={{display: 'none'}}>
            Title 1 Title 2 Title 3 Title 4 Title 5 Title 6
          </div>
        </>
      )}

      {/* Editor content */}
      <div className={`
        flex-1 flex editor-content relative
        ${state.preview === 'live' ? 'md:flex-row flex-col' : 'flex-row'}
        ${state.fullscreen ? 'min-h-0' : ''}
      `}>
        {/* Editor pane */}
        {(state.preview === 'edit' || state.preview === 'live') && (
          <div className={`
            ${state.preview === 'live'
              ? 'md:w-[60%] w-full md:h-full h-1/2'
              : 'w-full h-full'
            }
            relative editor-pane
          `}>
            {components?.textarea ? (
              components.textarea({
                value: state.markdown || '',
                onChange: handleTextareaChange,
                onScroll: handleTextareaScroll,
                highlightEnable,
                tabSize,
                defaultTabEnable,
                autoFocus,
                ...restTextareaProps, // Use restTextareaProps here
              })
            ) : (
              <Textarea
                ref={textareaRef}
                value={state.markdown || ''}
                onChange={handleTextareaChange}
                onScroll={handleTextareaScroll}
                highlightEnable={highlightEnable}
                tabSize={tabSize}
                defaultTabEnable={defaultTabEnable}
                autoFocus={autoFocus}
                {...restTextareaProps} // Use restTextareaProps here
              />
            )}
          </div>
        )}

        {/* Divider for live mode */}
        {state.preview === 'live' && (
          <div className="md:w-px md:h-auto w-full h-px bg-border editor-divider" />
        )}

        {/* Preview pane */}
        {(state.preview === 'preview' || state.preview === 'live') && (
          <div className={`
            ${state.preview === 'live'
              ? 'md:w-[40%] w-full md:h-full h-1/2'
              : 'w-full h-full'
            }
            relative preview-pane
          `}>
            {components?.preview ? (
              components.preview(state.markdown || '', state, dispatch)
            ) : (
              <MarkdownPreview
                ref={previewRef}
                source={state.markdown || ''}
                {...previewOptions}
              />
            )}
          </div>
        )}
      </div>

      {/* Drag bar */}
      {visibleDragbar && !state.fullscreen && (
        <DragBar
          height={typeof state.height === 'number' ? state.height : 400}
          minHeight={minHeight}
          maxHeight={maxHeight}
          onChange={handleDragBarChange}
        />
      )}

      {/* Bottom toolbar */}
      {!hideToolbar && toolbarBottom && (
        <Toolbar
          commands={filteredCommands}
          extraCommands={filteredExtraCommands}
          executeCommand={executeCommand}
          overflow={overflow}
          toolbarBottom={true}
          state={state}
          dispatch={dispatch}
        />
      )}
    </div>
  );

  if (!isMounted) {
    return editorMarkup;
  }

  if (state.fullscreen) {
    // Create a portal container with proper styles
    const portalContainer = document.createElement('div');
    portalContainer.style.position = 'fixed';
    portalContainer.style.top = '0';
    portalContainer.style.left = '0';
    portalContainer.style.width = '100vw';
    portalContainer.style.height = '100vh';
    portalContainer.style.zIndex = '9999';
    portalContainer.style.backgroundColor = 'var(--editor-background)';
    
    // Append to body if not already present
    if (!document.body.contains(portalContainer)) {
      document.body.appendChild(portalContainer);
    }
    
    // Cleanup function to remove portal container
    useEffect(() => {
      return () => {
        if (document.body.contains(portalContainer)) {
          document.body.removeChild(portalContainer);
        }
      };
    }, []);

    return createPortal(editorMarkup, portalContainer);
  }

  return editorMarkup;
})

InternalMarkdownEditor.displayName = 'InternalMarkdownEditor'

// Main editor component with provider
const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>((props, ref) => {
  return (
    <EditorProvider>
      <InternalMarkdownEditor ref={ref} {...props} />
    </EditorProvider>
  )
})

MarkdownEditor.displayName = 'MarkdownEditor'

export { MarkdownEditor }
