export interface User {
  id: string
  status?: number
  created_at: string
  updated_at: string
  name: string
  email?: string
  phone?: string
  avatar?: {
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
  role: string
}
