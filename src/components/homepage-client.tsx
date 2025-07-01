'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Keep useRouter for search bar
import { Post } from '@/types/database'
import { PostCard } from '@/components/post-card'
import { SearchBar, SearchResults } from '@/components/search-bar'
import { Pagination, PaginationInfo } from '@/components/pagination'
import { searchPosts, formatDate } from '@/lib/utils' // Remove paginateItems
import { ClientThemeToggle } from '@/components/client-theme-toggle'
import { CalendarDisplay } from '@/components/calendar-display'

interface HomePageClientProps {
  initialPosts: Post[]
  user: { id: string; email?: string } | null
  userIsAdmin: boolean
  initialPage: number
  totalPages: number
  totalItems: number
  postsPerPage: number
}

const POSTS_PER_PAGE = 6

export function HomePageClient({
  initialPosts: posts,
  user,
  userIsAdmin,
  initialPage,
  totalPages,
  totalItems,
  postsPerPage
}: HomePageClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  // currentPage is now controlled by initialPage from props
  const currentPage = initialPage

  // Debug: Log state changes
  console.log('HomePageClient render - currentPage:', currentPage, 'searchQuery:', searchQuery)

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return searchPosts(posts, searchQuery);
  }, [posts, searchQuery])

  // Paginated data is now passed via props, but we still need to filter for search
  const paginatedData = useMemo(() => {
    // If there's a search query, filter the initial posts
    const itemsToDisplay = searchQuery ? searchPosts(posts, searchQuery) : posts;

    return {
      items: itemsToDisplay, // These are already paginated from server, but filtered here
      totalItems: totalItems, // Total items from server
      totalPages: totalPages, // Total pages from server
      currentPage: initialPage, // Current page from server
      hasNextPage: initialPage < totalPages,
      hasPreviousPage: initialPage > 1
    };
  }, [posts, searchQuery, initialPage, totalPages, totalItems]);

  // Reset to first page when search or category changes
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // When search query changes, reset page to 1 and update URL
    const newSearchParams = new URLSearchParams();
    if (query) {
      newSearchParams.set('query', query);
    }
    newSearchParams.set('page', '1');
    router.push(`/?${newSearchParams.toString()}`);
  }, [router]);

  // Handle page change by updating URL search params
  const handlePageChange = useCallback((page: number) => {
    console.log('Homepage Pagination - handlePageChange called:', {
      requestedPage: page,
      currentPage: initialPage,
      totalPages: totalPages,
      totalItems: totalItems,
      postsPerPage: postsPerPage
    });

    const newSearchParams = new URLSearchParams();
    if (searchQuery) {
      newSearchParams.set('query', searchQuery);
    }
    newSearchParams.set('page', page.toString());
    router.push(`/?${newSearchParams.toString()}`);
  }, [initialPage, totalPages, totalItems, postsPerPage, router, searchQuery]);


  // Get featured post (most recent post)
  const featuredPost = posts.length > 0 ? posts[0] : null


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 shadow-lg border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground hover:text-primary transition-colors">
              My Blog
            </Link>
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
              <ClientThemeToggle />
              {user ? (
                <>
                  <span className="hidden lg:block text-sm text-muted-foreground truncate max-w-32">
                    Welcome, {user.email}
                  </span>
                  
                  {userIsAdmin && (
                    <Link
                      href="/admin/new-post"
                      className="bg-primary text-primary-foreground px-2 sm:px-3 lg:px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md touch-manipulation min-h-[44px] flex items-center justify-center"
                    >
                      <span className="hidden sm:inline">New Post</span>
                      <span className="sm:hidden text-lg">+</span>
                    </Link>
                  )}
                  {userIsAdmin && (
                    <Link
                      href="/admin/manage-posts"
                      className="bg-secondary text-secondary-foreground px-2 sm:px-3 lg:px-4 py-2 rounded-md hover:bg-secondary/80 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md touch-manipulation min-h-[44px] flex items-center justify-center"
                    >
                      <span className="hidden sm:inline">Manage</span>
                      <span className="sm:hidden text-lg">⚙️</span>
                    </Link>
                  )}
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md touch-manipulation min-h-[44px]"
                    >
                      <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md touch-manipulation min-h-[44px] flex items-center justify-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {posts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 lg:py-24">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">No posts yet</h2>
              <p className="text-muted-foreground mb-6">Start sharing your thoughts with the world!</p>
              {userIsAdmin && (
                <Link
                  href="/admin/new-post"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create your first post
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Main Content Layout with Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Content Area */}
              <div className="flex-1 lg:w-2/3 order-2 lg:order-1">
                {/* Search and Filter Section */}
                <section id="posts" className="mb-8 sm:mb-12">
                  <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                      <div className="text-center sm:text-left">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">All Posts</h2>
                        <p className="text-lg text-muted-foreground">
                          {posts.length} post{posts.length === 1 ? '' : 's'} available
                        </p>
                      </div>
                      <div className="w-full sm:max-w-xs">
                        <SearchBar onSearch={handleSearch} className="text-sm" />
                      </div>
                    </div>
                  </div>


                  {/* Search Results Info */}
                  <SearchResults query={searchQuery} totalResults={filteredPosts.length} />
                </section>

                {/* Posts Grid */}
                <section className="mb-16">
                  {paginatedData.items.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">No posts found</h3>
                      <p className="text-muted-foreground text-lg mb-6">Try adjusting your search terms or browse all posts</p>
                      <Link
                        href="#posts"
                        onClick={() => {
                          setSearchQuery('')
                          handlePageChange(1)
                        }}
                        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                      >
                        Clear Search
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                      {paginatedData.items
                        .map((post, index) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          className="animate-slide-up hover:scale-[1.02] transition-transform duration-300"
                          style={{
                            animationDelay: `${index * 0.05}s`
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Pagination */}
                {paginatedData.totalPages > 1 && (
                  <section className="mb-12 space-y-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                    <PaginationInfo
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={postsPerPage}
                    />
                  </section>
                )}
              </div>

              {/* Right Sidebar */}
              <aside className="lg:w-1/3 lg:max-w-sm order-1 lg:order-2">
                {/* Featured Post Section */}
                <CalendarDisplay />

                {/* Additional Sidebar Content - Recent Posts */}
                {posts.length > 1 && (
                  <section className="mb-8">
                    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recent Posts
                      </h3>
                      <div className="space-y-4">
                        {posts
                          .filter(post => post.id !== featuredPost?.id)
                          .slice(0, 3)
                          .map((post) => (
                          <div key={post.id} className="group">
                            <Link href={`/posts/${post.id}`} className="block">
                              <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                {post.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(post.created_at)}
                              </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
