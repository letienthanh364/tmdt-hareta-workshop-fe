import { t } from 'i18next'

export const HttpStatusMessage = new Map([
  ['ErruserNotFound', 'User not found'],
  ['ErrUsernameOrPasswordInvalid', 'email or password is invalid'],
  ['ErrEmailNotVerified', 'Your email is not verified'],
  ['ErrEmailExisted', 'Email already exists'],
  ['ErrEmailVerified', 'Email has been verified'],
  ['ErrOldPasswordIsInvalid', 'Your password is incorrect'],
  ['ErrWaitingForANewLink', 'You need to wait one minute to send another one'],
  ['ErrPasswordRecoveryNotFound', 'Invalid Link'],
  ['ErrLinkHasBeenExpired', 'Link has been expired'],
  ['ErrQuantityExceed', 'The quantity you are trying to add exceed our store'],
  ['ErrInvalidRequest', t('error messages.Invalid request', { ns: 'utils' })],
  ['ErrCannotGetOrder', t('error messages.Cannot get the order', { ns: 'utils' })],
  ['ERR_NETWORK', t('error messages.Network Error', { ns: 'utils' })],
  ['ECONNABORTED', t('error messages.Timeout Error', { ns: 'utils' })]
])
