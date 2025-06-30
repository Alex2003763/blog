'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { DragBarProps } from '../types'

export function DragBar({ 
  height, 
  minHeight, 
  maxHeight, 
  onChange, 
  className = '' 
}: DragBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startHeight, setStartHeight] = useState(height)
  const dragBarRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setIsDragging(true)
    setStartY(event.clientY)
    setStartHeight(height)
    
    // Add cursor style to body
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'
  }, [height])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return
    
    const deltaY = event.clientY - startY
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))
    
    onChange(newHeight)
  }, [isDragging, startY, startHeight, minHeight, maxHeight, onChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    
    // Remove cursor style from body
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  // Handle touch events for mobile
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault()
    const touch = event.touches[0]
    setIsDragging(true)
    setStartY(touch.clientY)
    setStartHeight(height)
  }, [height])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!isDragging) return
    
    event.preventDefault()
    const touch = event.touches[0]
    const deltaY = touch.clientY - startY
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))
    
    onChange(newHeight)
  }, [isDragging, startY, startHeight, minHeight, maxHeight, onChange])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  return (
    <div
      ref={dragBarRef}
      className={`
        relative h-2 bg-border hover:bg-border/80 cursor-ns-resize
        flex items-center justify-center group
        transition-colors duration-200
        ${isDragging ? 'bg-primary/20' : ''}
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize editor height"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          const newHeight = Math.max(minHeight, height - 10)
          onChange(newHeight)
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          const newHeight = Math.min(maxHeight, height + 10)
          onChange(newHeight)
        }
      }}
    >
      {/* Visual indicator */}
      <div className="flex space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-0.5 bg-current rounded-full" />
        <div className="w-8 h-0.5 bg-current rounded-full" />
        <div className="w-8 h-0.5 bg-current rounded-full" />
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Drag to resize • Use arrow keys • Height: {height}px
      </div>
    </div>
  )
}
