import { ProductImageListRespone } from 'src/types/productImage.type'
import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'item-image/'

const LIMIT = 100

const producImageApi = {
  getImageList(id: string) {
    return http.get<ProductImageListRespone>(`${URL}?page=1&limit=${LIMIT}&id=${id}`)
  },
  addImage(body: { item_id: string; color: string; file: File }) {
    return http.post<SuccessRespone<string>>(`${URL}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteImage(body: { id: string }) {
    return http.delete(`${URL}`, { data: body })
  }
}

export default producImageApi
