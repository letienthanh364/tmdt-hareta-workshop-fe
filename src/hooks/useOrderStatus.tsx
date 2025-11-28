import { useTranslation } from 'react-i18next'

export default function useOrderStatus() {
  const { t } = useTranslation('order')
  const OrderState = [
    t('state.Awaiting Payment'),
    t('state.Preparing Package'),
    t('state.Delivering'),
    t('state.Delivered'),
    t('state.Received')
  ]
  return OrderState
}
