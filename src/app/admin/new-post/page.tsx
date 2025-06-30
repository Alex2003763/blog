// import { redirect } from 'next/navigation'
// import { getCurrentUser, isAdmin } from '@/lib/auth'
import NewPostForm from './new-post-form'

export default async function NewPostPage() {
  // Temporarily bypass authentication for testing
  // TODO: Re-enable authentication in production
  // const user = await getCurrentUser()

  // For testing purposes, allow access without authentication
  // if (!user) {
  //   redirect('/login')
  // }

  // const userIsAdmin = await isAdmin(user.id)

  // if (!userIsAdmin) {
  //   redirect('/')
  // }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <NewPostForm />
      </div>
    </div>
  )
}
