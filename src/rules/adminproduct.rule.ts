import * as yup from 'yup'

export const createProductSchema = yup.object({
  name: yup.string().required('Name is required'),
  group_id: yup.string().required('Group ID is required'),
  category: yup.string().required('Category is required'),
  collection: yup.string().required('Collection is required'),
  type: yup.string().required('Type is required'),
  color: yup.string().required('Color is required'),
  product_line: yup.string().required('Product line is required'),
  original_price: yup.number().required('Original price is required'),
  price: yup.number().required('Current price is required'),
  quantity: yup.number().required('Quantity is required'),
  description: yup.string().required('Description is required')
})
export type CreateProductSchema = yup.InferType<typeof createProductSchema>

export const updateProductSchema = yup.object({
  id: yup.string().required('ID is required'),
  name: yup.string().default(''),
  category: yup.string().default(''),
  collection: yup.string().default(''),
  type: yup.string().default(''),
  color: yup.string().default(''),
  product_line: yup.string().default(''),
  description: yup.string().default(''),
  original_price: yup.number().default(0),
  price: yup.number().default(0),
  quantity: yup.number().default(0),
  discount: yup.number().default(0),
  tag: yup.number().default(0),
  like_count: yup.number().default(0),
  sold: yup.number().default(0),
  cron_status: yup.number().default(0),
  avatar_url: yup.string().default('')
})
export type UpdateProductSchema = yup.InferType<typeof updateProductSchema>
