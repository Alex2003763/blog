import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, isAdmin } from '@/lib/auth'

import { HomePageClient } from '@/components/homepage-client'
import { HeroSkeleton, PostGridSkeleton } from '@/components/skeleton'

export default async function Home() {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    // Handle the error appropriately
    return <div>Error loading posts.</div>
  }

  const user = await getCurrentUser()
  const userIsAdmin = user ? await isAdmin(user.id) : false

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSkeleton />
          <PostGridSkeleton />
        </div>
      }>
        <HomePageClient
          initialPosts={posts ?? []}
          user={user ?? null}
          userIsAdmin={userIsAdmin ?? false}
        />
      </Suspense>
    </div>
  )
}
