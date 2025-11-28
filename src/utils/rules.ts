import * as yup from 'yup'

const handleEmailYup = () => {
  return yup
    .string()
    .required('Email address is required')
    .email('Incorrect email format')
    .min(5, 'Email address must have at least 5 characters')
    .max(160, 'Email address can only have a total length of 160 characters')
}

const handlePasswordYup = () => {
  return yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be 8-16 characters')
    .max(16, 'Password must be 8-16 characters')
}
const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Confirm Password is required')
    .min(8, 'Password must be 8-16 characters')
    .max(16, 'Password must be 8-16 characters')
    .oneOf([yup.ref(refString)], 'Passwords do not match')
}

export const registerSchema = yup.object({
  email: handleEmailYup(),
  password: handlePasswordYup(),
  confirm_password: handleConfirmPasswordYup('password'),
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone number is required')
})
export type RegisterSchema = yup.InferType<typeof registerSchema>

export const requestVerifySchema = yup.object({
  email: handleEmailYup()
})

export const productSchema = yup.object({
  name: yup.string().trim().default('')
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { lower_price, upper_price } = this.parent as { lower_price: string; upper_price: string }
  if (lower_price !== '' && upper_price !== '') {
    return Number(upper_price) >= Number(lower_price)
  }
  return true
}

export const priceSchema = yup.object({
  lower_price: yup.string().default('').test({
    name: 'price-is-not-allowed',
    message: 'Price range is not allowed',
    test: testPriceMinMax
  }),
  upper_price: yup.string().default('').test({
    name: 'price-is-not-allowed',
    message: 'Price range is not allowed',
    test: testPriceMinMax
  })
})

export const userSchema = yup.object({
  name: yup.string().default('').max(160, 'Maximum name length is 160 character'),
  phone: yup.string().default('').max(20, 'Maximum phone number length is 20 characters'),
  avatar: yup.string().default('').max(1000, 'Can not use this image')
})

export const changePasswordSchema = yup.object({
  old_password: yup.string().default(''),
  new_password: handlePasswordYup(),
  confirm_new_password: handleConfirmPasswordYup('new_password')
})
export type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>

export const passwordRecoverySchema = yup.object({
  email: handleEmailYup(),
  new_password: handlePasswordYup(),
  confirm_new_password: handleConfirmPasswordYup('new_password')
})
export type PasswordRecoverySchema = yup.InferType<typeof passwordRecoverySchema>

export const orderSchema = yup.object({
  email: handleEmailYup(),
  name: yup.string().required('Customer name is required'),
  phone: yup.string().required('Customer phone number is required'),
  address: yup.string().required('Address is required'),
  id: yup.array().of(yup.string()).required()
})
export type OrderSchema = yup.InferType<typeof orderSchema>

export const orderSchemaForGuest = yup.object({
  email: handleEmailYup(),
  name: yup.string().required('Customer name is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  item: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        quantity: yup.number().required()
      })
    )
    .required()
})
export type OrderSchemaForGuest = yup.InferType<typeof orderSchemaForGuest>

export const loginSchema = yup.object({
  email: handleEmailYup(),
  password: yup.string().required('Password is required')
})
export type LoginSchema = yup.InferType<typeof loginSchema>

export type RequestVerifySchema = yup.InferType<typeof requestVerifySchema>

export type ProductSchema = yup.InferType<typeof productSchema>

export type PriceSchema = yup.InferType<typeof priceSchema>

export type UserSchema = yup.InferType<typeof userSchema>

export const searchSchema = yup.object({
  name: yup.string().trim().default('')
})
export type SearchSchema = yup.InferType<typeof searchSchema>
