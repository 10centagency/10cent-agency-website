import BlogForm from '@/components/admin/BlogForm'

interface EditBlogPageProps {
  params: {
    id: string
  }
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  return <BlogForm postId={params.id} />
}
