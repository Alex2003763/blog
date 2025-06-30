'use client'

import React, { useState, useEffect } from 'react'

export function CalendarDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

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
      second: '2-digit',
      hour12: true,
    })
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
}