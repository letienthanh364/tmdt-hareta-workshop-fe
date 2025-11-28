import { useState } from 'react'
import FloatingOnClick from '../FoatingOnClick'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'
import { setLanguageToLS } from 'src/utils/utils'

export default function RegisterLanguage() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const closePopover = () => {
    setIsOpen(false)
  }

  //? Change language
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const changeLanguage = (lng: 'en' | 'vi') => {
    closePopover && closePopover()
    setLanguageToLS(lng)
    i18n.changeLanguage(lng)
  }

  return (
    <div className='group'>
      <FloatingOnClick
        renderPopover={
          <div className='relative flex w-28 select-none flex-col rounded-lg bg-lightColor700 p-2 text-base text-darkText/90 shadow-lg dark:bg-darkColor700 dark:text-lightText/90 tablet:w-40 desktop:text-lg'>
            <button
              className='px-2 py-1 text-sm hover:font-medium hover:text-primaryColor tabletSmall:text-base tablet:px-1 tablet:py-1 tablet:text-lg desktopLarge:px-2 desktopLarge:py-2 desktopLarge:text-xl'
              onClick={() => changeLanguage('en')}
            >
              English
            </button>
            <button
              className='px-2 py-1 text-sm hover:font-medium hover:text-primaryColor tabletSmall:text-base tablet:px-1 tablet:py-1 tablet:text-lg desktopLarge:px-2 desktopLarge:py-2 desktopLarge:text-xl'
              onClick={() => changeLanguage('vi')}
            >
              Tiếng Việt
            </button>
          </div>
        }
        className='flex cursor-default select-none items-center space-x-0.5 p-1 text-xs font-semibold text-darkText duration-200 dark:text-lightText tabletSmall:text-sm tablet:text-sm desktopLarge:text-lg'
        isOpen={isOpen}
        handleClick={handleClick}
        openChange={setIsOpen}
      >
        <div className='z-10 flex items-center'>
          <p>{currentLanguage}</p>
          {isOpen && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='h-5 w-5 desktop:h-6 desktop:w-6'
            >
              <path
                fillRule='evenodd'
                d='M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z'
                clipRule='evenodd'
              />
            </svg>
          )}
          {!isOpen && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='h-5 w-5 desktop:h-6 desktop:w-6'
            >
              <path
                fillRule='evenodd'
                d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
      </FloatingOnClick>
    </div>
  )
}
