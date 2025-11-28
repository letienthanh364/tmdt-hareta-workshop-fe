import * as yup from 'yup'
const currentDate = new Date()

export const imageSchema = yup.object({
  time_from: yup
    .date()
    .max(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
      'Chọn thời điểm trong quá khứ'
    ),
  time_to: yup
    .date()
    .max(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
      'Chọn thời điểm trong quá khứ'
    )
})

export type ImageSchema = yup.InferType<typeof imageSchema>
