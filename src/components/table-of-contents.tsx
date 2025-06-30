'use client'

import { useState, useEffect } from 'react'
import { TOCItem } from '@/lib/toc'

interface TableOfContentsProps {
  toc: TOCItem[]
  className?: string
}

interface TOCItemComponentProps {
  item: TOCItem
  activeId: string
  onItemClick: (id: string) => void
}

function TOCItemComponent({ item, activeId, onItemClick }: TOCItemComponentProps) {
  const isActive = activeId === item.id
  const hasActiveChild = item.children.some(child => 
    child.id === activeId || child.children.some(grandchild => grandchild.id === activeId)
  )

  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault()
          onItemClick(item.id)
        }}
        className={`
          block py-1 px-2 text-sm rounded-md transition-all duration-200 hover:bg-muted/50
          ${isActive 
            ? 'text-primary bg-primary/10 font-medium border-l-2 border-primary' 
            : hasActiveChild
            ? 'text-foreground/80'
            : 'text-muted-foreground hover:text-foreground'
          }
        `}
        style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
      >
        {item.title}
      </a>
      {item.children.length > 0 && (
        <ul className="mt-1">
          {item.children.map((child) => (
            <TOCItemComponent
              key={child.id}
              item={child}
              activeId={activeId}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function TableOfContents({ toc, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that's most visible
        let maxRatio = 0
        let mostVisibleId = ''

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisibleId = entry.target.id
          }
        })

        if (mostVisibleId) {
          setActiveId(mostVisibleId)
        }
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    // Observe all headings
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80 // Account for any fixed headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      
      window.scrollTo({ top: y, behavior: 'smooth' })
      
      // Update URL hash
      window.history.replaceState(null, '', `#${id}`)
      
      // Close mobile menu
      setIsOpen(false)
    }
  }

  if (toc.length === 0) {
    return null
  }

  return (
    <>
      {/* Mobile TOC Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 right-4 z-40 bg-card border border-border rounded-lg p-2 shadow-lg hover:bg-muted transition-colors"
        aria-label="Toggle table of contents"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile TOC Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* TOC Sidebar */}
      <div className={`
        ${className}
        lg:block lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-6rem)]
        ${isOpen ? 'block' : 'hidden'}
        lg:relative lg:z-auto lg:bg-transparent lg:border-0 lg:shadow-none lg:p-0
        fixed top-20 right-4 z-40 bg-card border border-border rounded-xl shadow-xl p-4 max-h-[70vh] w-80 max-w-[calc(100vw-2rem)]
      `}>
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h3 className="font-semibold text-foreground text-sm lg:text-base">
            Table of Contents
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-muted rounded"
            aria-label="Close table of contents"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="overflow-y-auto lg:max-h-[calc(100vh-12rem)] max-h-[60vh]">
          <ul className="space-y-1">
            {toc.map((item) => (
              <TOCItemComponent
                key={item.id}
                item={item}
                activeId={activeId}
                onItemClick={handleItemClick}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
