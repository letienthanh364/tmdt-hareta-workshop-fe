import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'
import { BlogListConfig } from 'src/types/blog.type'

export type BlogListQueryConfig = {
  [key in keyof BlogListConfig]: string
}

export const BLOG_LIMIT = 20

export default function useBlogListQueryConfig() {
  const queryParams: BlogListQueryConfig = useQueryParams()
  const queryConfig: BlogListQueryConfig = omitBy(
    {
      title: queryParams.title,
      tag: queryParams.tag,
      page: queryParams.page || 1,
      limit: queryParams.limit || BLOG_LIMIT
    },
    isUndefined
  )
  return queryConfig
}
