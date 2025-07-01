'use client'

import React, { useState, useEffect, useCallback, memo } from 'react'

export const CalendarDisplay = memo(function CalendarDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  // Memoized update function to prevent unnecessary re-renders
  const updateDateTime = useCallback(() => {
    setCurrentDateTime(new Date())
  }, [])

  useEffect(() => {
    // Set mounted to true to prevent hydration mismatch
    setMounted(true)

    // Update only once per minute instead of every second to reduce re-renders
    // This prevents interference with pagination and other interactive elements
    const timer = setInterval(updateDateTime, 60000) // Update every minute

    // Also update immediately when component mounts
    updateDateTime()

    return () => clearInterval(timer)
  }, [updateDateTime])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Prevent hydration mismatch by showing consistent content until mounted
  if (!mounted) {
    // Use a fixed date for initial server render to prevent hydration mismatch
    const staticDate = new Date('2024-01-01T12:00:00')
    return (
      <section className="mb-8">
        <div className="bg-card border border-primary/20 rounded-lg p-6 shadow-xl text-center">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Today's Date & Time
          </h2>
          <p className="text-2xl font-semibold text-foreground mb-2">
            {formatDate(staticDate)}
          </p>
          <p className="text-3xl font-extrabold text-primary">
            {formatTime(staticDate)}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <div className="bg-card border border-primary/20 rounded-lg p-6 shadow-xl text-center">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Today's Date & Time
        </h2>
        <p className="text-2xl font-semibold text-foreground mb-2">
          {formatDate(currentDateTime)}
        </p>
        <p className="text-3xl font-extrabold text-primary">
          {formatTime(currentDateTime)}
        </p>
      </div>
    </section>
  )
})