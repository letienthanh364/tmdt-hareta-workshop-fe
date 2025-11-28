import { useTranslation } from 'react-i18next'

export default function useYupErrorMessages() {
  const { t } = useTranslation('yuperrors')
  const YupErrorMessages: Map<string, string> = new Map([
    ['email or password is invalid', t('login.email or password is invalid', { ns: 'yuperrors' })],
    ['Email address is required', t('email.Email address is required', { ns: 'yuperrors' })],
    ['Incorrect email format', t('email.Incorrect email format', { ns: 'yuperrors' })],
    [
      'Email address must have at least 5 characters',
      t('email.Email address must have at least 5 characters', { ns: 'yuperrors' })
    ],
    [
      'Email address can only have a total length of 160 characters',
      t('email.Email address can only have a total length of 160 characters', { ns: 'yuperrors' })
    ],
    ['Password is required', t('password.Password is required', { ns: 'yuperrors' })],
    ['Confirm Password is required', t('password.Confirm Password is required', { ns: 'yuperrors' })],
    ['Password must be 8-16 characters', t('password.Password must be 8-16 characters', { ns: 'yuperrors' })],
    ['Passwords do not match', t('password.Passwords do not match', { ns: 'yuperrors' })],
    ['Name is required', t('register.Name is required', { ns: 'yuperrors' })],
    ['Phone number is required', t('register.Phone number is required', { ns: 'yuperrors' })],
    ['Price range is not allowed', t('price.Price range is not allowed', { ns: 'yuperrors' })],
    ['Maximum name length is 160 character', t('user.Maximum name length is 160 character', { ns: 'yuperrors' })],
    [
      'Maximum phone number length is 20 characters',
      t('user.Maximum phone number length is 20 characters', { ns: 'yuperrors' })
    ],
    ['Can not use this image', t('user.Can not use this image', { ns: 'yuperrors' })],
    ['Customer name is required', t('order.Customer name is required', { ns: 'yuperrors' })],
    ['Customer phone number is required', t('order.Customer phone number is required', { ns: 'yuperrors' })],
    ['Address is required', t('order.Address is required', { ns: 'yuperrors' })]
  ])
  return YupErrorMessages
}
