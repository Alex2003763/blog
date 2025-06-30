import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types/database'
import { ThemeToggle } from '@/components/theme-toggle'
import ManagePostsClient from './manage-posts-client'

async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return posts || []
}

export default async function ManagePostsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const userIsAdmin = await isAdmin(user.id)
  
  if (!userIsAdmin) {
    redirect('/')
  }

  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-foreground hover:text-primary transition-colors"
            >
              My Blog
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Link
                href="/admin/new-post"
                className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">+</span>
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Manage Posts</h1>
              <p className="text-muted-foreground">View, edit, and delete your blog posts</p>
            </div>
          </div>
        </div>

        <ManagePostsClient posts={posts} />
      </div>
    </div>
  )
}
