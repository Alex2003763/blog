'use client'

import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
  maxVisiblePages = 5
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Calculate start and end of visible range
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
      
      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('...')
        }
      }
      
      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis and last page if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const visiblePages = getVisiblePages()

  const buttonClass = (isActive: boolean = false, isDisabled: boolean = false) =>
    cn(
      "flex items-center justify-center",
      "min-w-[40px] h-10 px-3",
      "text-sm font-medium",
      "border border-border rounded-lg",
      "transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-primary/20",
      isActive
        ? "bg-primary text-primary-foreground border-primary shadow-sm"
        : isDisabled
        ? "bg-muted text-muted-foreground cursor-not-allowed"
        : "bg-background text-foreground hover:bg-muted hover:border-primary/30 hover:shadow-sm"
    )

  return (
    <nav 
      className={cn("flex items-center justify-center gap-1 sm:gap-2", className)}
      aria-label="Pagination"
    >
      {/* First Page Button */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className={buttonClass(false, false)}
          aria-label="Go to first page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={buttonClass(false, currentPage <= 1)}
        aria-label="Go to previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline ml-1">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center min-w-[40px] h-10 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={buttonClass(page === currentPage, false)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={buttonClass(false, currentPage >= totalPages)}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Last Page Button */}
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className={buttonClass(false, false)}
          aria-label="Go to last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  )
}

interface PaginationInfoProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  className?: string
}

export function PaginationInfo({
  currentPage,
  totalItems,
  itemsPerPage,
  className
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={cn(
      "flex items-center justify-center text-sm text-muted-foreground",
      className
    )}>
      Showing {startItem} to {endItem} of {totalItems} posts
    </div>
  )
}
