import * as yup from 'yup'

export const createEventSchema = yup.object({
  overall_content: yup.string().required('Bắt buộc có phần giới thiệu'),
  detail_content: yup.string().required('Bắt buộc có phần nội dung'),
  date_start: yup.date().required('Bắt buộc có ngày bắt đầu'),
  date_end: yup.date().required('Bắt buộc có ngày kết thúc'),
  discount: yup.number().required('Bắt buộc có phần giảm giá'),
  avatar: yup.string()
})

export type CreateEventSchema = yup.InferType<typeof createEventSchema>

export const updateEventSchema = yup.object({
  id: yup.string().required('có ID bài viết'),
  overall_content: yup.string().required('Bắt buộc có phần giới thiệu'),
  detail_content: yup.string().required('Bắt buộc có phần nội dung'),
  date_start: yup.date().required('Bắt buộc có ngày bắt đầu'),
  date_end: yup.date().required('Bắt buộc có ngày kết thúc'),
  discount: yup.number().required('Bắt buộc có phần giảm giá'),
  avatar: yup.string().default('')
})

export type UpdateEventSchema = yup.InferType<typeof updateEventSchema>
