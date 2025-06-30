'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Search posts...", 
  className,
  autoFocus = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    // Debounce search to avoid too many calls
    const timeoutId = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className={cn(
      "relative group",
      className
    )} suppressHydrationWarning>
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        "bg-background border border-border rounded-lg",
        "hover:border-primary/30 focus-within:border-primary/50",
        "shadow-sm hover:shadow-md focus-within:shadow-md",
        isFocused && "ring-2 ring-primary/20"
      )} suppressHydrationWarning>
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center pointer-events-none" suppressHydrationWarning>
          <svg 
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              isFocused || query ? "text-primary" : "text-muted-foreground"
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 sm:py-3",
            "bg-transparent border-0 outline-none",
            "text-foreground placeholder:text-muted-foreground",
            "text-sm sm:text-base"
          )}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className={cn(
              "absolute right-3 flex items-center justify-center",
              "w-5 h-5 rounded-full",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
            aria-label="Clear search"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Indicator */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1">
          <div className="text-xs text-muted-foreground px-3 py-1">
            Searching for &quot;{query}&quot;...
          </div>
        </div>
      )}
    </div>
  )
}

interface SearchResultsProps {
  query: string
  totalResults: number
  className?: string
}

export function SearchResults({ query, totalResults, className }: SearchResultsProps) {
  if (!query) return null

  return (
    <div className={cn(
      "flex items-center justify-between",
      "px-4 py-2 mb-6",
      "bg-muted/50 rounded-lg border border-border",
      className
    )}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm text-foreground">
          {totalResults === 0 ? (
            <>No results found for <strong>&quot;{query}&quot;</strong></>
          ) : (
            <>
              {totalResults} result{totalResults === 1 ? '' : 's'} for <strong>&quot;{query}&quot;</strong>
            </>
          )}
        </span>
      </div>
      
      {totalResults === 0 && (
        <div className="text-xs text-muted-foreground">
          Try different keywords
        </div>
      )}
    </div>
  )
}
