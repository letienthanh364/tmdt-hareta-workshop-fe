import { t } from 'i18next'

const ItemTag = ['none', 'top seller', 'signature', 'favourite']

export default ItemTag

export const ProductTagList = [
  { name: t('aside filter.newest', { ns: 'store' }) },
  { name: t('aside filter.top seller', { ns: 'store' }) },
  { name: t('aside filter.signature', { ns: 'store' }) },
  { name: t('aside filter.favourite', { ns: 'store' }) }
]
