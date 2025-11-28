import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  isDialog?: boolean
}

export default function AnimateTransition({ children, isDialog = false }: Props) {
  return (
    <>
      {!isDialog && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          //   exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
        >
          {children}
        </motion.div>
      )}
      {isDialog && children}
    </>
  )
}
