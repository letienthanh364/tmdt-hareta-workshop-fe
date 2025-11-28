import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import mainPath from 'src/constants/path'

export default function NotFoundPage() {
  //! Multi languages
  const { t } = useTranslation('home')

  return (
    <main className='flex h-screen w-full flex-col items-center justify-center bg-lightBg dark:bg-darkBg'>
      <h1 className='text-9xl font-extrabold tracking-widest text-darkText dark:text-lightText'>404</h1>
      <div className='absolute rotate-12 rounded bg-haretaColor px-2 text-sm'>{t('not found page.Page not found')}</div>
      <button className='mt-5'>
        <Link
          to={mainPath.home}
          className='group relative inline-block text-sm font-medium text-haretaColor focus:outline-none focus:ring active:text-orange-500'
        >
          <span className='bg-haretext-haretaColor absolute inset-0 translate-x-0.5 translate-y-0.5 transition-transform group-hover:translate-x-0 group-hover:translate-y-0'></span>

          <span className='relative block rounded-md border border-current bg-[#1A2238] px-8 py-3 hover:bg-haretaColor hover:text-darkText'>
            <span title='not-found-page'>{t('not found page.Go home')}</span>
          </span>
        </Link>
      </button>
    </main>
  )
}
