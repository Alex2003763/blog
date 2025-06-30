'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  )
}

export function PostCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-card rounded-xl shadow-sm border border-border p-6 lg:p-8",
      className
    )}>
      <div className="space-y-4">
        {/* Title skeleton */}
        <Skeleton className="h-7 w-3/4" />
        
        {/* Content skeleton - multiple lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Footer skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="text-center py-16 lg:py-24 space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-12 w-2/3 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
      <Skeleton className="h-12 w-40 mx-auto" />
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="relative">
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}

export function FeaturedPostSkeleton() {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 lg:p-8 border border-primary/20">
      <div className="space-y-4">
        {/* Featured badge */}
        <Skeleton className="h-6 w-20" />
        
        {/* Title */}
        <Skeleton className="h-8 w-4/5" />
        
        {/* Content */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

export function FilterSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-20 rounded-full" />
      ))}
    </div>
  )
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Skeleton className="h-10 w-20" />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-10" />
      ))}
      <Skeleton className="h-10 w-20" />
    </div>
  )
}
