import Link from 'next/link'
import { Post } from '@/types/database'
import { calculateReadingTime, createExcerpt, formatDate, cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
  featured?: boolean
  className?: string
  showExcerpt?: boolean
  excerptLength?: number
  style?: React.CSSProperties
}

export function PostCard({ 
  post, 
  featured = false, 
  className,
  showExcerpt = true,
  excerptLength = 200
}: PostCardProps) {
  const readingTime = calculateReadingTime(post.content)
  const excerpt = showExcerpt ? createExcerpt(post.content, excerptLength) : ''
  const isRecent = new Date(post.created_at) > new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Within last 1 day

  if (featured) {
    return (
      <article className={cn(
        "group relative overflow-hidden",
        "bg-gradient-to-br from-primary/5 via-primary/3 to-background",
        "rounded-2xl border border-primary/20 shadow-lg",
        "hover:shadow-xl hover:border-primary/30",
        "transition-all duration-300",
        "p-6 lg:p-8",
        className
      )}>
        {/* Featured Badge */}
        <div className="absolute top-4 right-4" suppressHydrationWarning>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
        </div>

        <div className="space-y-4" suppressHydrationWarning>
          <div suppressHydrationWarning>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
              <Link href={`/posts/${post.id}`} className="block">
                {post.title}
              </Link>
            </h2>
            
            {showExcerpt && (
              <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                {excerpt}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2" suppressHydrationWarning>
            <div className="flex items-center gap-4 text-sm text-muted-foreground" suppressHydrationWarning>
              <time className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.created_at)}
              </time>
              
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readingTime} min read
              </span>
            </div>

            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-all duration-200 group/link text-sm"
            >
              Read full article
              <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={cn(
      "group relative overflow-hidden",
      "bg-card rounded-xl shadow-sm border border-border",
      "hover:shadow-xl hover:border-primary/30 hover:-translate-y-1",
      "transition-all duration-300 ease-out",
      "p-6",
      className
    )}>
      {/* New Post Indicator */}
      {isRecent && (
        <div className="absolute top-6 right-6 z-10" suppressHydrationWarning>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-xl transform hover:scale-105 transition-all duration-300 ease-out">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            New
          </span>
        </div>
      )}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" suppressHydrationWarning />

      <div className="relative space-y-4" suppressHydrationWarning>
        <div suppressHydrationWarning>
          <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2 pr-20">
            <Link href={`/posts/${post.id}`} className="block">
              {post.title}
            </Link>
          </h3>

          {showExcerpt && (
            <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">
              {excerpt}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border/50" suppressHydrationWarning>
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <time className="flex items-center gap-2 text-sm text-muted-foreground" title={formatDate(post.created_at)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.created_at)}
            </time>

            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime}
            </span>
          </div>

          <Link
            href={`/posts/${post.id}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200"
          >
            Read more
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
