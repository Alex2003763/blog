'use client'

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export interface EditorTheme {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  systemTheme: 'light' | 'dark' | undefined
}

/**
 * Hook to integrate with the blog's existing theme system
 * Uses next-themes to maintain consistency with the rest of the application
 */
export function useEditorTheme(): EditorTheme {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure we're mounted before accessing theme to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Return safe defaults during SSR
  if (!mounted) {
    return {
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: () => {},
      systemTheme: undefined,
    }
  }

  return {
    theme: (theme as 'light' | 'dark' | 'system') || 'system',
    resolvedTheme: (resolvedTheme as 'light' | 'dark') || 'light',
    setTheme: setTheme as (theme: 'light' | 'dark' | 'system') => void,
    systemTheme: systemTheme as 'light' | 'dark' | undefined,
  }
}

/**
 * Get CSS custom properties for the current theme
 * These match the blog's existing CSS variables
 */
export function getThemeVariables(resolvedTheme: 'light' | 'dark') {
  if (resolvedTheme === 'dark') {
    return {
      '--editor-background': '222.2 84% 4.9%', // dark background
      '--editor-foreground': '210 40% 98%', // dark foreground
      '--editor-card': '222.2 84% 4.9%', // dark card
      '--editor-card-foreground': '210 40% 98%', // dark card foreground
      '--editor-popover': '222.2 84% 4.9%', // dark popover
      '--editor-popover-foreground': '210 40% 98%', // dark popover foreground
      '--editor-primary': '210 40% 98%', // dark primary
      '--editor-primary-foreground': '222.2 84% 4.9%', // dark primary foreground
      '--editor-secondary': '217.2 32.6% 17.5%', // dark secondary
      '--editor-secondary-foreground': '210 40% 98%', // dark secondary foreground
      '--editor-muted': '217.2 32.6% 17.5%', // dark muted
      '--editor-muted-foreground': '215 20.2% 65.1%', // dark muted foreground
      '--editor-accent': '217.2 32.6% 17.5%', // dark accent
      '--editor-accent-foreground': '210 40% 98%', // dark accent foreground
      '--editor-destructive': '0 62.8% 30.6%', // dark destructive
      '--editor-destructive-foreground': '210 40% 98%', // dark destructive foreground
      '--editor-border': '217.2 32.6% 17.5%', // dark border
      '--editor-input': '217.2 32.6% 17.5%', // dark input
      '--editor-ring': '212.7 26.8% 83.9%', // dark ring
    }
  }

  // Light theme
  return {
    '--editor-background': '0 0% 100%', // light background
    '--editor-foreground': '222.2 84% 4.9%', // light foreground
    '--editor-card': '0 0% 100%', // light card
    '--editor-card-foreground': '222.2 84% 4.9%', // light card foreground
    '--editor-popover': '0 0% 100%', // light popover
    '--editor-popover-foreground': '222.2 84% 4.9%', // light popover foreground
    '--editor-primary': '222.2 47.4% 11.2%', // light primary
    '--editor-primary-foreground': '210 40% 98%', // light primary foreground
    '--editor-secondary': '210 40% 96%', // light secondary
    '--editor-secondary-foreground': '222.2 84% 4.9%', // light secondary foreground
    '--editor-muted': '210 40% 96%', // light muted
    '--editor-muted-foreground': '215.4 16.3% 46.9%', // light muted foreground
    '--editor-accent': '210 40% 96%', // light accent
    '--editor-accent-foreground': '222.2 84% 4.9%', // light accent foreground
    '--editor-destructive': '0 84.2% 60.2%', // light destructive
    '--editor-destructive-foreground': '210 40% 98%', // light destructive foreground
    '--editor-border': '214.3 31.8% 91.4%', // light border
    '--editor-input': '214.3 31.8% 91.4%', // light input
    '--editor-ring': '222.2 84% 4.9%', // light ring
  }
}

/**
 * Apply theme variables to a DOM element
 */
export function applyThemeVariables(element: HTMLElement, resolvedTheme: 'light' | 'dark') {
  const variables = getThemeVariables(resolvedTheme)
  
  Object.entries(variables).forEach(([property, value]) => {
    element.style.setProperty(property, value)
  })
}

/**
 * Get the data-color-mode attribute value for the current theme
 * This matches the blog's existing theme system
 */
export function getColorModeAttribute(resolvedTheme: 'light' | 'dark'): 'light' | 'dark' {
  return resolvedTheme
}

/**
 * Hook to automatically apply theme variables to the editor container
 */
export function useThemeVariables(containerRef: React.RefObject<HTMLElement>) {
  const { resolvedTheme } = useEditorTheme()

  useEffect(() => {
    if (containerRef.current) {
      applyThemeVariables(containerRef.current, resolvedTheme)
      containerRef.current.setAttribute('data-color-mode', getColorModeAttribute(resolvedTheme))
    }
  }, [containerRef, resolvedTheme])

  return { resolvedTheme, colorMode: getColorModeAttribute(resolvedTheme) }
}
