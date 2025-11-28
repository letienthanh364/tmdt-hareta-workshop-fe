import { BlogDetail, BlogListConfig, BlogListType } from 'src/types/blog.type'
import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = '/blog'
const tagURL = '/blog/tag'

interface CreateBlogForm {
  title: string
  content: string
  avatar?: string
}

interface UpdateBlogForm {
  id: string
  title?: string
  content?: string
  avatar?: string
}

const blogApi = {
  getBlogList(params: BlogListConfig) {
    return http.get<BlogListType>(`${URL}/`, { params })
  },
  getBlogDetail(blogId: string) {
    return http.get<SuccessRespone<BlogDetail>>(`${URL}/${blogId}`)
  },
  createBlog(body: CreateBlogForm) {
    return http.post<SuccessRespone<string>>(`${URL}/`, body)
  },
  updateBlog(body: UpdateBlogForm) {
    return http.put<SuccessRespone<string>>(`${URL}/`, body)
  },
  deleteBlog(body: { id: string }) {
    return http.delete<SuccessRespone<string>>(`${URL}/`, { data: body })
  },
  getBlogTagList() {
    return http.get<SuccessRespone<string[]>>(`${tagURL}/`)
  },
  addTagForBlog(body: { blog_id: string; tag: string[] }) {
    return http.post<SuccessRespone<string>>(`${tagURL}/`, body)
  },
  deleteTagOfBlog(body: { blog_id: string; tag: string }) {
    return http.delete<SuccessRespone<string>>(`${tagURL}/`, { data: body })
  }
}

export default blogApi
