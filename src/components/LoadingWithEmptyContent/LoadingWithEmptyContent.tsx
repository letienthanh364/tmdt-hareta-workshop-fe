import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { useViewport } from 'src/hooks/useViewport'
import { ColorRing } from 'react-loader-spinner'

export default function LoadingWithEmptyContent() {
  const viewport = useViewport()
  const height = viewport.height

  return (
    <div className='w-full' style={{ height: height }}>
      <Fragment>
        <motion.div
          className='fixed inset-0 z-10 bg-white dark:bg-black'
          initial={{ opacity: 0.0 }}
          animate={{
            opacity: 0.8
          }}
          exit={{ opacity: 0 }}
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
    </div>
  )
}
