import { FloatingOverlay } from '@floating-ui/react'
import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { ColorRing } from 'react-loader-spinner'

export default function LoadingPage() {
  return (
    <FloatingOverlay lockScroll>
      <Fragment>
        <motion.div
          className='fixed inset-0 z-10 bg-black dark:bg-black'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.8
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className='fixed left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl shadow-sm'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ColorRing
            visible={true}
            height='80'
            width='80'
            ariaLabel='blocks-loading'
            wrapperStyle={{}}
            wrapperClass='blocks-wrapper'
            colors={['#ff6a00', '#ff6a00', '#ff6a00', '#ff6a00', '#ff6a00']}
          />
        </motion.div>
      </Fragment>
    </FloatingOverlay>
  )
}
