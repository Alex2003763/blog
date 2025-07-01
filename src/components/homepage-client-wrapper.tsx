'use client'

import dynamic from 'next/dynamic'
import type { Post } from '@/types/database'
import { HeroSkeleton, PostGridSkeleton } from '@/components/skeleton'

const HomePageClient = dynamic(
  () => import('./homepage-client').then(mod => mod.HomePageClient),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSkeleton />
        <PostGridSkeleton />
      </div>
    ),
  }
)

interface HomePageClientWrapperProps {
  initialPosts: Post[]
  user: { id: string; email?: string } | null
  userIsAdmin: boolean
  initialPage: number
  totalPages: number
  totalItems: number
  postsPerPage: number
}

export default function HomePageClientWrapper(props: HomePageClientWrapperProps) {
  return <HomePageClient {...props} />
}