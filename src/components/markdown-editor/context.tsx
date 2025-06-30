'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { EditorState, EditorAction } from './types'
import { getDefaultCommands, getDefaultExtraCommands } from './commands'

// Default editor state
const defaultState: EditorState = {
  markdown: '',
  preview: 'live',
  fullscreen: false,
  height: 400,
  highlightEnable: true,
  tabSize: 2,
  defaultTabEnable: false,
  scrollTop: 0,
  scrollTopPreview: 0,
  commands: getDefaultCommands(),
  extraCommands: getDefaultExtraCommands(),
  barPopup: {},
}

// Reducer function
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  return { ...state, ...action }
}

// Context type
interface EditorContextType {
  state: EditorState
  dispatch: (action: EditorAction) => void
}

// Create context
const EditorContext = createContext<EditorContextType | undefined>(undefined)

// Provider props
interface EditorProviderProps {
  children: ReactNode
  initialState?: Partial<EditorState>
}

// Provider component
export function EditorProvider({ children, initialState = {} }: EditorProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, {
    ...defaultState,
    ...initialState,
  })

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  )
}

// Hook to use editor context
export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}

// Hook for editor state only
export function useEditorState() {
  const { state } = useEditor()
  return state
}

// Hook for editor dispatch only
export function useEditorDispatch() {
  const { dispatch } = useEditor()
  return dispatch
}

// Utility function to set group popup states
export function setGroupPopupStates(popupStates: Record<string, boolean>, value: boolean = false): Record<string, boolean> {
  const newStates: Record<string, boolean> = {}
  Object.keys(popupStates).forEach((key) => {
    newStates[key] = value
  })
  return newStates
}

// Utility function to toggle a specific popup
export function togglePopup(popupStates: Record<string, boolean>, key: string): Record<string, boolean> {
  return {
    ...setGroupPopupStates(popupStates, false),
    [key]: !popupStates[key],
  }
}

// Utility function to close all popups
export function closeAllPopups(popupStates: Record<string, boolean>): Record<string, boolean> {
  return setGroupPopupStates(popupStates, false)
}

// Export context for direct access if needed
export { EditorContext }
