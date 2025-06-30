'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Command, ToolbarProps } from '../types'
import { useEditor, togglePopup, closeAllPopups } from '../context'

interface CommandButtonProps {
  command: Command
  disabled?: boolean
  executeCommand: (command: Command, groupName?: string) => void
  index: number
}

function CommandButton({ command, disabled = false, executeCommand, index }: CommandButtonProps) {
  const { state, dispatch } = useEditor()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Custom render function
  if (command.render) {
    return command.render(command, disabled, executeCommand, index) || null
  }

  // Divider
  if (command.name === 'divider') {
    return (
      <div 
        className="w-px h-6 bg-border mx-1" 
        role="separator" 
        aria-orientation="vertical" 
      />
    )
  }

  // Group with children commands
  if (command.children && Array.isArray(command.children)) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            inline-flex items-center justify-center
            w-8 h-8 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px]
            rounded-md p-1 sm:p-0
            hover:bg-accent hover:text-accent-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${isOpen ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
          `}
          aria-label={command.buttonProps?.['aria-label'] || command.name}
          title={command.buttonProps?.title || command.name}
          {...command.buttonProps}
        >
          {command.icon}
          <svg 
            className="w-3 h-3 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 min-w-[120px]">
            <div className="py-1">
              {command.children.map((childCommand, childIndex) => (
                <button
                  key={childCommand.name || childIndex}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    executeCommand(childCommand, command.groupName)
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center"
                  aria-label={childCommand.buttonProps?.['aria-label'] || childCommand.name}
                >
                  {childCommand.icon && (
                    <span className="mr-2 flex-shrink-0">
                      {childCommand.icon}
                    </span>
                  )}
                  {childCommand.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Group with children function (popup content)
  if (command.children && typeof command.children === 'function') {
    const isPopupOpen = state.barPopup[command.groupName || command.name] || false

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            dispatch({
              barPopup: togglePopup(state.barPopup, command.groupName || command.name)
            })
          }}
          className={`
            inline-flex items-center justify-center
            w-8 h-8 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px]
            rounded-md p-1 sm:p-0
            hover:bg-accent hover:text-accent-foreground
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${isPopupOpen ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
          `}
          aria-label={command.buttonProps?.['aria-label'] || command.name}
          title={command.buttonProps?.title || command.name}
          {...command.buttonProps}
        >
          {command.icon}
        </button>

        {isPopupOpen && (
          <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50">
            {command.children({
              close: () => dispatch({ 
                barPopup: closeAllPopups(state.barPopup) 
              }),
              execute: () => executeCommand(command, command.groupName),
              getState: () => state.textarea ? {
                text: state.textarea.value,
                selectedText: state.textarea.value.slice(
                  state.textarea.selectionStart,
                  state.textarea.selectionEnd
                ),
                selection: {
                  start: state.textarea.selectionStart,
                  end: state.textarea.selectionEnd,
                }
              } : false,
              textApi: state.textarea ? {
                replaceSelection: (text: string) => {
                  if (state.textarea) {
                    const start = state.textarea.selectionStart
                    const end = state.textarea.selectionEnd
                    const before = state.textarea.value.substring(0, start)
                    const after = state.textarea.value.substring(end)
                    state.textarea.value = before + text + after
                    state.textarea.selectionStart = state.textarea.selectionEnd = start + text.length
                    state.textarea.focus()
                    const event = new Event('input', { bubbles: true })
                    state.textarea.dispatchEvent(event)
                  }
                  return state.textarea ? {
                    text: state.textarea.value,
                    selectedText: '',
                    selection: {
                      start: state.textarea.selectionStart,
                      end: state.textarea.selectionEnd,
                    }
                  } : { text: '', selectedText: '', selection: { start: 0, end: 0 } }
                },
                setSelectionRange: (selection) => {
                  if (state.textarea) {
                    state.textarea.focus()
                    state.textarea.selectionStart = selection.start
                    state.textarea.selectionEnd = selection.end
                  }
                  return state.textarea ? {
                    text: state.textarea.value,
                    selectedText: state.textarea.value.slice(selection.start, selection.end),
                    selection,
                  } : { text: '', selectedText: '', selection: { start: 0, end: 0 } }
                },
                insertText: (text: string, position?: number) => {
                  if (state.textarea) {
                    const pos = position ?? state.textarea.selectionStart
                    const before = state.textarea.value.substring(0, pos)
                    const after = state.textarea.value.substring(pos)
                    state.textarea.value = before + text + after
                    state.textarea.selectionStart = state.textarea.selectionEnd = pos + text.length
                    state.textarea.focus()
                    const event = new Event('input', { bubbles: true })
                    state.textarea.dispatchEvent(event)
                  }
                  return state.textarea ? {
                    text: state.textarea.value,
                    selectedText: '',
                    selection: {
                      start: state.textarea.selectionStart,
                      end: state.textarea.selectionEnd,
                    }
                  } : { text: '', selectedText: '', selection: { start: 0, end: 0 } }
                },
                getState: () => state.textarea ? {
                  text: state.textarea.value,
                  selectedText: state.textarea.value.slice(
                    state.textarea.selectionStart,
                    state.textarea.selectionEnd
                  ),
                  selection: {
                    start: state.textarea.selectionStart,
                    end: state.textarea.selectionEnd,
                  }
                } : { text: '', selectedText: '', selection: { start: 0, end: 0 } }
              } : {
                replaceSelection: () => ({ text: '', selectedText: '', selection: { start: 0, end: 0 } }),
                setSelectionRange: () => ({ text: '', selectedText: '', selection: { start: 0, end: 0 } }),
                insertText: () => ({ text: '', selectedText: '', selection: { start: 0, end: 0 } }),
                getState: () => ({ text: '', selectedText: '', selection: { start: 0, end: 0 } })
              }
            })}
          </div>
        )}
      </div>
    )
  }

  // Regular button
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => executeCommand(command, command.groupName)}
      className={`
        inline-flex items-center justify-center
        w-8 h-8 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px]
        rounded-md p-1 sm:p-0
        hover:bg-accent hover:text-accent-foreground
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        text-muted-foreground
      `}
      aria-label={command.buttonProps?.['aria-label'] || command.name}
      title={command.buttonProps?.title || command.name}
      {...command.buttonProps}
    >
      {command.icon}
    </button>
  )
}

export function Toolbar({
  commands,
  extraCommands,
  executeCommand,
  className = '',
  toolbarBottom = false
}: ToolbarProps) {
  const { state, dispatch } = useEditor()

  const handleContainerClick = () => {
    dispatch({ barPopup: closeAllPopups(state.barPopup) })
  }

  return (
    <div
      className={`
        flex items-center justify-between
        px-2 py-2 sm:px-3 sm:py-2
        bg-card border-border toolbar
        ${toolbarBottom ? 'border-t' : 'border-b'}
        ${className}
      `}
      onClick={handleContainerClick}
    >
      {/* Left side commands */}
      <div className="flex items-center space-x-0.5 sm:space-x-1 overflow-x-auto toolbar-commands">
        {commands.map((command, index) => (
          <CommandButton
            key={command.name || index}
            command={command}
            executeCommand={executeCommand}
            index={index}
          />
        ))}
      </div>

      {/* Right side commands */}
      {extraCommands.length > 0 && (
        <div className="flex items-center space-x-0.5 sm:space-x-1 ml-2 sm:ml-4 flex-shrink-0">
          {extraCommands.map((command, index) => (
            <CommandButton
              key={command.name || index}
              command={command}
              executeCommand={executeCommand}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
