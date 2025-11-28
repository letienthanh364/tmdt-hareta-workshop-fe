import { User } from 'src/types/user.type'
import { SuccessRespone } from 'src/types/utils.type'
import http from 'src/utils/http'

interface BodyUpdateProfile extends Omit<User, 'id' | 'role' | 'status' | 'created_at' | 'updated_at'> {
  password?: string
  newPasswird?: string
}

interface ChangePasswordForm {
  old_password: string
  new_password: string
  confirm_new_password: string
}

const userApi = {
  getProfile() {
    return http.get<SuccessRespone<User>>('/auth/')
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessRespone<string>>('/auth/', body)
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessRespone<string>>('/auth/avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  changePassword(body: ChangePasswordForm) {
    return http.post<SuccessRespone<string>>('/auth/change-password', body)
  }
}

export default userApi
