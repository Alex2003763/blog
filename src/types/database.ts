export interface Post {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  author_id?: string
}

export interface Profile {
  id: string
  email: string
  is_admin: boolean
  created_at: string
}
