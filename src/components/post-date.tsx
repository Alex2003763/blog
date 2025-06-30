'use client'

import { useState, useEffect } from 'react'

interface PostDateProps {
  date: string
  isUpdateDate?: boolean
}

export function PostDate({ date, isUpdateDate = false }: PostDateProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Initial check
    checkWidth()

    // Add resize listener
    window.addEventListener('resize', checkWidth)

    // Cleanup
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // Prevent hydration mismatch by showing consistent content until mounted
  if (!mounted) {
    return (
      <span className="flex items-center text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
        {isUpdateDate && (
          <>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Updated </span>
          </>
        )}
        {new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </span>
    )
  }

  return (
    <span className="flex items-center text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
      {isUpdateDate && (
        <>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="hidden sm:inline">Updated </span>
        </>
      )}
      {new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: isMobile ? undefined : 'numeric'
      })}
    </span>
  )
}