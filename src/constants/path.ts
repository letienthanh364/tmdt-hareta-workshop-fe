const mainPath = {
  home: '/',
  login: '/login',
  register: '/register',
  store: '/store',
  productDetail: '/store/:nameId',
  cart: '/cart',
  user: '/user',
  blogs: '/blogs',
  events: '/events',
  requestVerify: '/request-verify-email',
  verifyEmail: '/verify-email/:code',
  AuthPasswordRecoveryRequestEmail: '/request-password-recovery',
  AuthPasswordRecovery: '/password-recovery/:slug',
  order: '/order',
  orderTracking: '/order-tracking',
  privacyAndTerms: '/privacy-and-terms'
} as const
export default mainPath

export const adminPath = {
  mainPage: '/admin',

  // Product
  products: '/admin/products',
  productList: '/admin/products/list',
  productDetail: '/admin/products/:nameId',
  createProductGroup: '/admin/products/create-group',
  createProduct: '/admin/products/create-product',
  updateProduct: '/admin/products/update/item',
  productImage: '/admin/products/images',
  uploadProductAvatar: '/admin/products/images/avatar',
  deleteProductPage: '/admin/products/delete',
  deleteGroup: '/admin/products/delete/delete-group',
  deleteProduct: '/admin/products/delete/delete-product',

  // Image
  images: '/admin/images',
  uploadImages: '/admin/images/upload',
  deleteImages: '/admin/images/delete',

  // Order
  orders: '/admin/orders',

  // Event
  events: '/admin/events',
  eventDetail: '/admin/events/:eventId',
  eventCreate: '/admin/events/create',

  // Blog
  blogs: '/admin/blogs',
  blogDetail: '/admin/blogs/:blogId',
  blogCreate: '/admin/blogs/create'
} as const

export const privacyPath = {
  ProductInformation: 'productInformation',
  OrderingAndPayments: 'orderingAndPayments',
  ShippingAndDelivery: 'shippingAndDelivery',
  ReturnsAndRefunds: 'returnsAndRefunds',
  ProductWarranty: 'productWarranty',
  IntellectualProperty: 'intellectualProperty',
  InformationCollection: 'informationCollection',
  UseOfInformation: 'useOfInformation',
  DataProtection: 'dataProtection',
  SharingOfInformation: 'sharingOfInformation',
  CookiesAndTracking: 'cookiesAndTracking',
  ThirdPartyLinks: 'thirdPartyLinks',
  ChildrenPrivacy: 'childrenPrivacy',
  ChangeToThePrivacyPolicy: 'changeToThePrivacyPolicy',
  TermAndConditions: 'termAndConditions'
}

export const blogPath = {
  blogs: '/blogs',
  blogDetail: '/blogs/:blogId'
}

export const orderPath = {
  order: '/order',
  checkout: '/order/checkout'
}

export const orderTrackingPath = {
  orderTracking: '/order-tracking',
  orderDetail: '/order-tracking/:orderId',
  orderPayment: '/order-tracking/:orderId/payment'
}

export const eventPath = {
  events: '/events',
  eventDetail: '/events/:eventId'
}

export const userPath = {
  user: '/user',
  profile: '/user/profile',
  wishList: '/user/wishlist',
  password: '/user/password'
}
