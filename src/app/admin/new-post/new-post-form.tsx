'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CherryEditor } from '@/components/cherry-editor'
import { createClient } from '@/lib/supabase/client'

export default function NewPostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
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
      
      const { error: insertError } = await supabase
        .from('posts')
        .insert([
          {
            title: title.trim(),
            content: content.trim()
          }
        ])

      if (insertError) {
        throw insertError
      }

      // Redirect to homepage on success
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Error creating post:', err)
      setError('Error creating post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Create New Post
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Share your thoughts with the world using our markdown editor</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-all duration-200 font-medium shadow-sm hover:shadow-md inline-flex items-center justify-center group text-xs"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg inline-flex items-center justify-center group text-xs"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Publish Post
                  </>
                )}
              </button>
            </div>
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
                  minHeight="600px"
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
