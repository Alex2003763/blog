import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { Post } from '@/types/database'

import MarkdownContent from '@/components/markdown-content'
import TableOfContents from '@/components/table-of-contents'
import { ClientThemeToggle } from '@/components/client-theme-toggle'
import { AdminActions } from '@/components/admin-actions'
import { BackToTop } from '@/components/back-to-top'
import { PostDate } from '@/components/post-date'
import { PostCard } from '@/components/post-card'
import { generateTOC } from '@/lib/toc'

async function getRecommendedPosts(currentPostId: string, limit: number = 3): Promise<Post[]> {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .neq('id', currentPostId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recommended posts:', error);
    return [];
  }

  return posts || [];
}

async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return post
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = params.id
  const post = await getPost(id)
  
  if (!post) {
    notFound()
  }

  const recommendedPosts = await getRecommendedPosts(id)
  const user = await getCurrentUser()
  const userIsAdmin = user ? await isAdmin(user.id) : false

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
              <ClientThemeToggle />
              {user ? (
                <>
                  <span className="hidden sm:block text-sm text-muted-foreground">
                    Welcome, {user.email}
                  </span>
                  {userIsAdmin && (
                    <>
                      <Link
                        href="/admin/new-post"
                        className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        <span className="hidden sm:inline">New Post</span>
                        <span className="sm:hidden">+</span>
                      </Link>
                      <Link
                        href="/admin/manage-posts"
                        className="bg-secondary text-secondary-foreground px-3 sm:px-4 py-2 rounded-md hover:bg-secondary/80 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        <span className="hidden sm:inline">Manage</span>
                        <span className="sm:hidden">⚙️</span>
                      </Link>
                    </>
                  )}
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
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="lg:flex lg:gap-8">
          {/* Article Content */}
          <div className="lg:flex-1 lg:max-w-4xl">
            {/* Navigation Breadcrumb */}
            <nav className="mb-4 sm:mb-6 lg:mb-8" aria-label="Breadcrumb">
              <div className="flex items-center space-x-2 text-sm">
                <Link
                  href="/"
                  className="inline-flex items-center text-muted-foreground hover:text-primary transition-all duration-200 group font-medium"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
                  {post.title}
                </span>
              </div>
            </nav>

            {/* Article Content */}
            <article className="bg-card rounded-2xl shadow-xl border border-border animate-fade-in">
              {/* Article Header */}
              <header className="relative p-4 sm:p-6 lg:p-8 border-b border-border">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>

                <div className="relative">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-card-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
                    {post.title}
                  </h1>

                  {/* Article Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <PostDate date={post.created_at} />

                      {post.updated_at !== post.created_at && (
                        <PostDate date={post.updated_at} isUpdateDate={true} />
                      )}
                    </div>

                    {/* Reading Time Estimate */}
                    <div className="flex items-center text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {Math.max(1, Math.ceil(post.content.split(' ').length / 200))} min read
                    </div>
                  </div>
                </div>
              </header>

              {/* Article Body */}
              <div className="p-4 sm:p-6 lg:p-8">
                <MarkdownContent
                  content={post.content}
                  className="prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-p:mb-2
                            prose-strong:text-foreground prose-strong:font-semibold
                            prose-code:text-primary prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4
                            prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:pl-6 prose-blockquote:py-2
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                            prose-li:text-muted-foreground prose-li:leading-relaxed
                            prose-img:rounded-lg prose-img:shadow-md prose-img:border prose-img:border-border
                            prose-hr:border-border prose-hr:my-8"
                />
              </div>
            </article>

            {/* Admin Actions */}
            {userIsAdmin && (
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl border border-border shadow-lg animate-slide-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Admin Actions
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Admin Only
                  </span>
                </div>
                <AdminActions postId={post.id} />
              </div>
            )}

            {/* Recommended Posts Section */}
            {recommendedPosts.length > 0 && (
              <section className="mt-6 sm:mt-8">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center px-1">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Recommended Posts
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedPosts.map((recommendedPost) => (
                    <PostCard
                      key={recommendedPost.id}
                      post={recommendedPost}
                      showExcerpt={true}
                      excerptLength={120}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Table of Contents Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <TableOfContents toc={generateTOC(post.content)} />
          </div>
        </div>
      </main>

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  )
}
