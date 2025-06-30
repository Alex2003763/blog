import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Post } from '@/types/database'
import EditPostForm from './edit-post-form'

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

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const userIsAdmin = await isAdmin(user.id)
  
  if (!userIsAdmin) {
    redirect('/')
  }

  const post = await getPost(id)
  
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <EditPostForm post={post} />
      </div>
    </div>
  )
}
