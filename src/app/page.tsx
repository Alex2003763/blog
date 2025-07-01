import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import HomePageClientWrapper from '@/components/homepage-client-wrapper'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: Props) {
  const POSTS_PER_PAGE = 6 // Define posts per page here

  // Get page number from searchParams using proper async access
  const params = await searchParams
  const page = Number(params.page) || 1

  const supabase = await createClient()
  
  const offset = (page - 1) * POSTS_PER_PAGE

  // Fetch total count first
  const { count: totalPostsCount, error: countError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  if (countError) {
    console.error('Error fetching post count:', countError)
    return <div>Error loading posts.</div>
  }

  const totalPages = Math.ceil((totalPostsCount || 0) / POSTS_PER_PAGE) || 1
  const validPage = Math.max(1, Math.min(page, totalPages))

  // Fetch paginated posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1)

  if (error) {
    console.error('Error fetching posts:', error)
    // Handle the error appropriately
    return <div>Error loading posts.</div>
  }

  const user = await getCurrentUser()
  const userIsAdmin = user ? await isAdmin(user.id) : false

  // If the requested page is invalid, redirect to the valid page
  if (page !== validPage) {
    const newSearchParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    )
    newSearchParams.set('page', validPage.toString())
    // This will trigger a full page reload to the correct page
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('/?${newSearchParams.toString()}')`,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HomePageClientWrapper
        initialPosts={posts ?? []}
        user={user ?? null}
        userIsAdmin={userIsAdmin ?? false}
        initialPage={validPage}
        totalPages={totalPages}
        totalItems={totalPostsCount || 0}
        postsPerPage={POSTS_PER_PAGE}
      />
    </div>
  )
}
