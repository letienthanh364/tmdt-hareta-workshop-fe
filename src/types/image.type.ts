export interface Image {
  id: string
  status: number
  created_at: string
  updated_at: string
  url: string
  filename: string
  width: number
  height: number
  cloud_name: string
  extension: string
}

export interface ImageList {
  data: Image[]
  paging: {
    page: number
    limit: number
    total: number
    cursor: string
    next_cursor: string
  }
}

export interface ImageListConfig {
  time_from?: number | string
  time_to?: number | string
  page?: number | string
  limit?: number | string
  cursor?: string
}
