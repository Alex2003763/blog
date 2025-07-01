'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Post } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Edit, Eye, Calendar } from 'lucide-react'

interface ManagePostsClientProps {
  posts: Post[]
}

export default function ManagePostsClient({ posts: initialPosts }: ManagePostsClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title-asc' | 'title-desc'>('latest')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)
  const router = useRouter()

  const handleDelete = async (postId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(postId)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        throw error
      }

      // Remove deleted post from local state
      setPosts(posts.filter(post => post.id !== postId))

      // Refresh page to ensure data sync
      router.refresh()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const supabase = createClient()
      const { data: refreshedPosts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setPosts(refreshedPosts || [])
      router.refresh()
    } catch (error) {
      console.error('Error refreshing posts:', error)
      alert('Error refreshing posts. Please try again.')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(posts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `blog-posts-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = () => {
    if (isImporting) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setIsImporting(true)

      try {
        const text = await file.text()
        const importedPosts = JSON.parse(text)

        if (!Array.isArray(importedPosts)) {
          alert('Invalid file format. Please select a valid JSON file with posts array.')
          return
        }

        const supabase = createClient()

        // Insert imported posts
        const { error } = await supabase
          .from('posts')
          .insert(importedPosts.map(post => ({
            title: post.title,
            content: post.content,
            created_at: post.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          })))

        if (error) {
          throw error
        }

        alert(`Successfully imported ${importedPosts.length} posts!`)
        handleRefresh()
      } catch (error) {
        console.error('Error importing posts:', error)
        alert('Error importing posts. Please check the file format and try again.')
      } finally {
        setIsImporting(false)
      }
    }
    input.click()
  }

  const handleBulkActions = async () => {
    if (isBulkProcessing) return

    const selectedPosts = posts.filter((_, index) => {
      const checkbox = document.querySelector(`input[data-post-id="${posts[index].id}"]`) as HTMLInputElement
      return checkbox?.checked
    })

    if (selectedPosts.length === 0) {
      alert('Please select posts to perform bulk actions.')
      return
    }

    const action = prompt(`Selected ${selectedPosts.length} posts. Choose action:\n1. Delete\n2. Export\n\nEnter 1 or 2:`)

    if (action === '1') {
      if (confirm(`Are you sure you want to delete ${selectedPosts.length} selected posts? This action cannot be undone.`)) {
        setIsBulkProcessing(true)
        try {
          // Process deletions sequentially to avoid overwhelming the server
          for (const post of selectedPosts) {
            await handleDelete(post.id, post.title)
          }
        } finally {
          setIsBulkProcessing(false)
        }
      }
    } else if (action === '2') {
      const dataStr = JSON.stringify(selectedPosts, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = `selected-posts-${new Date().toISOString().split('T')[0]}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  // Sort posts based on current sort option
  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 lg:py-24">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">No posts yet</h2>
          <p className="text-muted-foreground mb-6">Start creating content for your blog!</p>
          <Link
            href="/admin/new-post"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create your first post
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-card rounded-xl border border-border p-6 hover-lift animate-fade-in shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-xl">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{posts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 hover-lift animate-fade-in shadow-sm hover:shadow-md transition-all duration-200" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Published Today</p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">
                {posts.filter(post => {
                  const today = new Date()
                  const postDate = new Date(post.created_at)
                  return postDate.toDateString() === today.toDateString()
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 hover-lift animate-fade-in shadow-sm hover:shadow-md transition-all duration-200" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">This Week</p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">
                {posts.filter(post => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(post.created_at) > weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              All Posts ({posts.length})
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-background border border-input rounded-lg px-3 py-1 text-sm hover:border-primary/50 focus:border-primary focus:outline-none transition-colors"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-3 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary focus:ring-primary"
                    onChange={(e) => {
                      const checkboxes = document.querySelectorAll('input[data-post-id]')
                      checkboxes.forEach((checkbox) => {
                        (checkbox as HTMLInputElement).checked = e.target.checked
                      })
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Title
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Published
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Updated
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {sortedPosts.slice(0, 5).map((post, index) => (
                <tr key={post.id} className="hover:bg-gradient-to-r hover:from-muted/20 hover:to-transparent transition-all duration-300 animate-slide-in group" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td className="px-3 py-6 text-center">
                    <input
                      type="checkbox"
                      data-post-id={post.id}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-start space-x-4">
                      {/* Post Icon */}
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>

                      {/* Post Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            {Math.ceil(post.content.split(' ').length / 200)} min
                          </span>
                        </div>
                        {/* Content preview removed */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {post.content.split(' ').length} words
                          </span>
                          <span className="sm:hidden flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm font-medium text-foreground mb-1">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 whitespace-nowrap hidden lg:table-cell">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-foreground mb-1">
                        {new Date(post.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {post.updated_at !== post.created_at ? (
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modified
                          </span>
                        ) : (
                          'No changes'
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/posts/${post.id}`}
                        className="inline-flex items-center justify-center w-9 h-9 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group/action"
                        title="View post"
                      >
                        <Eye className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                      </Link>
                      <Link
                        href={`/admin/edit-post/${post.id}`}
                        className="inline-flex items-center justify-center w-9 h-9 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all duration-200 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 group/action"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletingId === post.id}
                        className="inline-flex items-center justify-center w-9 h-9 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed group/action"
                        title="Delete post"
                      >
                        {deletingId === post.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="w-4 h-4 group-hover/action:scale-110 transition-transform" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-muted/20 px-6 py-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Export
              </button>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Quick Actions</h4>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/new-post"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create new post
            </Link>
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              )}
              {isImporting ? 'Importing...' : 'Import posts'}
            </button>
            <button
              onClick={handleBulkActions}
              disabled={isBulkProcessing}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBulkProcessing ? (
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              {isBulkProcessing ? 'Processing...' : 'Bulk actions'}
            </button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-foreground">Recent Activity</h4>
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                <span className="text-muted-foreground truncate">
                  {post.title.substring(0, 30)}...
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Storage section removed */}
      </div>
    </div>
  )
}
