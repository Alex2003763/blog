'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NewsletterSignupProps {
  className?: string
}

export function NewsletterSignup({ className }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call - replace with actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubscribed(true)
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
        "border border-primary/20 rounded-2xl",
        "p-8 lg:p-12",
        className
      )}>
        <div className="relative text-center space-y-4">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Welcome aboard! 🎉</h3>
          <p className="text-muted-foreground">
            Thank you for subscribing! You&apos;ll receive our latest posts and updates directly in your inbox.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(
      "relative overflow-hidden",
      "bg-gradient-to-br from-primary/10 via-primary/5 to-background",
      "border border-primary/20 rounded-2xl",
      "p-8 lg:p-12",
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="relative text-center space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
            Stay in the loop
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get the latest posts, insights, and updates delivered straight to your inbox. 
            Join our community of readers and never miss a story.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-background border border-border",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                  "transition-all duration-200",
                  error && "border-red-500 focus:ring-red-500/20"
                )}
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-6 py-3 rounded-lg font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 focus:bg-primary/90",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Weekly updates
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            No spam, ever
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Unsubscribe anytime
          </div>
        </div>
      </div>
    </section>
  )
}
