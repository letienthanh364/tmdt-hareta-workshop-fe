import { FloatingOverlay } from '@floating-ui/react'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import LoadingRing from 'src/components/LoadingRing'
import { useTranslation } from 'react-i18next'

export default function OrderProcessingDialog() {
  //! Multi languages
  const { t } = useTranslation('order')

  return (
    <FloatingOverlay lockScroll>
      <Fragment>
        <motion.div
          className='fixed inset-0 z-10 bg-black dark:bg-black'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className='fixed left-1/2 top-1/2 z-10 flex w-60 max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl bg-white px-4 py-6 shadow-sm dark:bg-black'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingRing />
          <div className='mt-2 text-lg font-semibold uppercase text-darkText dark:text-lightText tablet:text-xl desktopLarge:text-2xl'>
            {t('Processing...')}
          </div>
        </motion.div>
      </Fragment>
    </FloatingOverlay>
  )
}
