import classNames from 'classnames'
import useClickOutside from 'src/hooks/useClickOutside'
import AnimateChangeInHeight from '../AnimateChangeInHeight'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'
import { setLanguageToLS } from 'src/utils/utils'

interface Props {
  closePopover?: () => void
}

export default function ChangeLanguage({ closePopover }: Props) {
  //? Change language
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const changeLanguage = (lng: 'en' | 'vi') => {
    closePopover && closePopover()
    i18n.changeLanguage(lng)
    setLanguageToLS(lng)
  }

  const { visible, setVisible, ref } = useClickOutside(false)
  return (
    <div
      ref={ref}
      className={classNames('w-full rounded-md', {
        'bg-lightColor900/60 dark:bg-darkColor900/60': visible
      })}
    >
      <button
        className={classNames('flex w-full items-center rounded-md py-2 uppercase ', {
          'hover:bg-lightColor900/80 hover:font-semibold dark:hover:bg-darkColor900/80': !visible,
          'font-semibold': visible
        })}
        onClick={() => setVisible(!visible)}
      >
        <span>{currentLanguage}</span>
        {visible && (
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-6 w-6'>
            <path
              fillRule='evenodd'
              d='M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z'
              clipRule='evenodd'
            />
          </svg>
        )}
        {!visible && (
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-6 w-6'>
            <path
              fillRule='evenodd'
              d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
              clipRule='evenodd'
            />
          </svg>
        )}
      </button>
      <AnimateChangeInHeight className='w-full'>
        <AnimatePresence>
          {visible && (
            <motion.div className='flex w-full flex-col items-start space-y-1 rounded-b-md px-6 text-xs font-normal text-darkText dark:text-lightText tabletSmall:text-sm'>
              <button
                className='px-2 py-1 text-sm hover:text-primaryColor tabletSmall:text-base tablet:px-1 tablet:py-1 tablet:text-lg desktopLarge:text-xl'
                onClick={() => changeLanguage('en')}
              >
                English
              </button>
              <button
                className='px-2 py-1 text-sm hover:text-primaryColor tabletSmall:text-base tablet:px-1 tablet:py-1 tablet:text-lg desktopLarge:text-xl'
                onClick={() => changeLanguage('vi')}
              >
                Tiếng Việt
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateChangeInHeight>
    </div>
  )
}
