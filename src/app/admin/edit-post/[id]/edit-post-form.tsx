'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CherryEditor } from '@/components/cherry-editor'
import { createClient } from '@/lib/supabase/client'
import { Post } from '@/types/database'

interface EditPostFormProps {
  post: Post
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)

      if (updateError) {
        throw updateError
      }

      // Redirect to post page on success
      router.push(`/posts/${post.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error updating post:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      setError('Error updating post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header with Actions */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Editing Post</span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Auto-save enabled
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-primary h-1 rounded-full w-2/3 transition-all duration-300"></div>
            </div>
          </div>

          {/* Top Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/manage-posts"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-flex items-center px-3 py-2 rounded-lg hover:bg-muted/50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back to manage</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to discard all changes?')) {
                  setTitle(post.title)
                  setContent(post.content)
                  setError('')
                }
              }}
              className="text-muted-foreground hover:text-destructive transition-colors font-medium inline-flex items-center px-3 py-2 rounded-lg hover:bg-destructive/10"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Reset</span>
              <span className="sm:hidden">↻</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-xl animate-slide-in shadow-sm">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Error</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                Edit Post Details
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Update your post title and content below</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg inline-flex items-center justify-center group text-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Update Post
                </>
              )}
            </button>
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="flex items-center text-xs font-medium text-foreground">
                <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                Post Title
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-3 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-base placeholder:text-muted-foreground/60"
                  placeholder="Enter an engaging title for your post..."
                  disabled={isSubmitting}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {title.length}/100
                </div>
              </div>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label htmlFor="content" className="flex items-center text-xs font-medium text-foreground">
                <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                Post Content
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="border border-input rounded-lg overflow-hidden shadow-sm bg-background">
                <CherryEditor
                  value={content}
                  onChange={setContent}
                  minHeight="650px"
                  placeholder="Start writing your amazing content..."
                />
              </div>

              {/* Content Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 px-1">
                <span>Markdown supported</span>
                <div className="flex items-center gap-3">
                  <span>{content.split(' ').length} words</span>
                  <span>{content.length} characters</span>
                  <span>{Math.ceil(content.split(' ').length / 200)} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}
