import { t } from 'i18next'

const OrderState = [
  t('state.Awaiting Payment', { ns: 'order' }),
  t('state.Preparing Package', { ns: 'order' }),
  t('state.Delivering', { ns: 'order' }),
  t('state.Delivered', { ns: 'order' }),
  t('state.Received', { ns: 'order' })
]

export default OrderState
