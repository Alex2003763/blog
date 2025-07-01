'use client'

import { useState, useMemo } from 'react'
import { Pagination, PaginationInfo } from '@/components/pagination'
import { paginateItems } from '@/lib/utils'

// Generate sample posts for testing
const generateSamplePosts = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `Sample Post ${i + 1}`,
    content: `This is the content for sample post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    author_id: 'test-author'
  }))
}

const POSTS_PER_PAGE = 6

export function PaginationTest() {
  const [currentPage, setCurrentPage] = useState(1)
  
  // Generate 15 sample posts to test pagination
  const samplePosts = useMemo(() => generateSamplePosts(15), [])
  
  // Paginate the sample posts
  const paginatedData = useMemo(() => {
    return paginateItems(samplePosts, currentPage, POSTS_PER_PAGE)
  }, [samplePosts, currentPage])

  // Handle page change with validation
  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(samplePosts.length / POSTS_PER_PAGE) || 1
    const validPage = Math.max(1, Math.min(page, totalPages))
    console.log('Pagination Test - Page change:', {
      requestedPage: page,
      validPage,
      currentPage,
      totalPages,
      totalPosts: samplePosts.length
    })
    setCurrentPage(validPage)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pagination Test</h1>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Testing with {samplePosts.length} sample posts, {POSTS_PER_PAGE} per page
        </p>
        <p className="text-sm text-muted-foreground">
          Current page: {currentPage}, Total pages: {paginatedData.totalPages}
        </p>
      </div>

      {/* Sample Posts Display */}
      <div className="grid gap-4 mb-8">
        {paginatedData.items.map((post) => (
          <div key={post.id} className="p-4 border border-border rounded-lg bg-card">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{post.content}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Created: {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {paginatedData.totalPages > 1 && (
        <div className="space-y-4">
          <Pagination
            currentPage={paginatedData.currentPage}
            totalPages={paginatedData.totalPages}
            onPageChange={handlePageChange}
          />
          <PaginationInfo
            currentPage={paginatedData.currentPage}
            totalPages={paginatedData.totalPages}
            totalItems={paginatedData.totalItems}
            itemsPerPage={POSTS_PER_PAGE}
          />
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs">
          {JSON.stringify({
            currentPage,
            totalPages: paginatedData.totalPages,
            totalItems: paginatedData.totalItems,
            itemsOnCurrentPage: paginatedData.items.length,
            hasNextPage: paginatedData.hasNextPage,
            hasPreviousPage: paginatedData.hasPreviousPage
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
