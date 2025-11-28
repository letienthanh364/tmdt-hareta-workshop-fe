import { Image, ImageList, ImageListConfig } from 'src/types/image.type'
import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'auth/image'

export const imageApi = {
  getImageList(params: ImageListConfig) {
    return http.get<ImageList>(`${URL}/`, { params })
  },
  uploadImage(body: { file: File }) {
    return http.post<SuccessRespone<Image>>(`${URL}/`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteImage(body: { image_id: string }) {
    return http.delete(`${URL}/`, { data: body })
  }
}
