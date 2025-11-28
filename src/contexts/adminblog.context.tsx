import { useState, createContext } from 'react'
import { BlogType } from 'src/types/blog.type'

interface AdminBlogContextInterface {
  currentBlog: BlogType | null
  setCurrentBlog: React.Dispatch<React.SetStateAction<BlogType | null>>
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  updateTags: string[]
  setUpdateTags: React.Dispatch<React.SetStateAction<string[]>>
}

const initialAdminBlogContext: AdminBlogContextInterface = {
  currentBlog: null,
  setCurrentBlog: () => null,
  tags: [],
  setTags: () => null,
  updateTags: [],
  setUpdateTags: () => null
}

export const AdminBlogContext = createContext<AdminBlogContextInterface>(initialAdminBlogContext)

export const AdminBlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentBlog, setCurrentBlog] = useState<BlogType | null>(initialAdminBlogContext.currentBlog)
  const [tags, setTags] = useState<string[]>(initialAdminBlogContext.tags)
  const [updateTags, setUpdateTags] = useState<string[]>(initialAdminBlogContext.tags)

  return (
    <AdminBlogContext.Provider
      value={{
        currentBlog,
        setCurrentBlog,
        tags,
        setTags,
        updateTags,
        setUpdateTags
      }}
    >
      {children}
    </AdminBlogContext.Provider>
  )
}
