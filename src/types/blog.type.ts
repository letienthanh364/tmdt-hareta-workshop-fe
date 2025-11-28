import { JSONModel, PagingType } from './utils.type'

export interface BlogTagType {
  tag: string
}

export interface BlogType extends JSONModel {
  title: string
  avatar: string
  overall: string
  tags: BlogTagType[]
}

export interface BlogListType {
  data: BlogType[]
  paging: PagingType
}

export interface BlogListConfig {
  title?: string
  tag?: string
  page?: number | string
  limit?: number | string
}

export interface BlogDetail extends JSONModel {
  title: string
  avatar: string
  overall: string
  content: string
  tags: BlogTagType[]
}
