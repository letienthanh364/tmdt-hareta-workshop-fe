import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLanguageFromLS } from 'src/utils/utils'

//! ENGLISH
import header_en from 'src/locales/en/header.json'
import footer_en from 'src/locales/en/footer.json'
import home_en from 'src/locales/en/home.json'
import store_en from 'src/locales/en/store.json'
import support_en from 'src/locales/en/support.json'
import user_en from 'src/locales/en/user.json'
import productdetail_en from 'src/locales/en/productdetail.json'
import login_en from 'src/locales/en/login.json'
import cart_en from 'src/locales/en/cart.json'
import yuperrors_en from 'src/locales/en/yuperrors.json'
import utils_en from 'src/locales/en/utils.json'
import order_en from 'src/locales/en/order.json'
import privacyAndTerms_en from 'src/locales/en/privacyAndTerms.json'
import blog_en from 'src/locales/en/blog.json'
import event_en from 'src/locales/en/event.json'

//! VIETNAMESE
import header_vi from 'src/locales/vi/header.json'
import footer_vi from 'src/locales/vi/footer.json'
import home_vi from 'src/locales/vi/home.json'
import store_vi from 'src/locales/vi/store.json'
import support_vi from 'src/locales/vi/support.json'
import user_vi from 'src/locales/vi/user.json'
import productdetail_vi from 'src/locales/vi/productdetail.json'
import login_vi from 'src/locales/vi/login.json'
import cart_vi from 'src/locales/vi/cart.json'
import yuperrors_vi from 'src/locales/vi/yuperrors.json'
import utils_vi from 'src/locales/vi/utils.json'
import order_vi from 'src/locales/vi/order.json'
import privacyAndTerms_vi from 'src/locales/vi/privacyAndTerms.json'
import blog_vi from 'src/locales/vi/blog.json'
import event_vi from 'src/locales/vi/event.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en: {
    header: header_en,
    footer: footer_en,
    home: home_en,
    store: store_en,
    support: support_en,
    user: user_en,
    productdetail: productdetail_en,
    login: login_en,
    cart: cart_en,
    order: order_en,
    privacyAndTerms: privacyAndTerms_en,
    yuperrors: yuperrors_en,
    utils: utils_en,
    blog: blog_en,
    event: event_en
  },
  vi: {
    header: header_vi,
    footer: footer_vi,
    home: home_vi,
    store: store_vi,
    support: support_vi,
    user: user_vi,
    productdetail: productdetail_vi,
    login: login_vi,
    cart: cart_vi,
    order: order_vi,
    privacyAndTerms: privacyAndTerms_vi,
    yuperrors: yuperrors_vi,
    utils: utils_vi,
    blog: blog_vi,
    event: event_vi
  }
} as const

export const defaultNS = 'header'

const ns = [
  'header',
  'footer',
  'home',
  'store',
  'support',
  'user',
  'productdetail',
  'login',
  'cart',
  'order',
  'privacyAndTerms',
  'login',
  'yuperrors',
  'blog',
  'event'
]

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: getLanguageFromLS(),
  ns,
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})
