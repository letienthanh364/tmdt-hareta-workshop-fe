import {
  arrow,
  offset,
  safePolygon,
  shift,
  useFloating,
  useHover,
  useInteractions,
  type Placement,
  FloatingOverlay,
  FloatingArrow
} from '@floating-ui/react'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { ElementType, useContext, useRef, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  colorCode?: string
  placement?: Placement
  offsetValue?: number
}

export default function CustomPopover({
  children,
  className,
  renderPopover,
  as: Element = 'div',
  initialOpen,
  placement,
  offsetValue = 14
}: Props) {
  const { theme } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen || false)

  const arrowRef = useRef(null)
  const { x, y, refs, strategy, middlewareData, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(offsetValue), shift(), arrow({ element: arrowRef })],
    placement: placement || 'bottom'
  })
  const hover = useHover(context, {
    handleClose: safePolygon({
      requireIntent: false,
      blockPointerEvents: true
    })
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([hover])
  return (
    <div>
      <Element className={className} ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </Element>
      <AnimatePresence>
        {isOpen && (
          <FloatingOverlay lockScroll>
            <motion.div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 10,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              {...getFloatingProps()}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                width={30}
                height={10}
                className={classNames({ ' fill-[#2c2c32]': theme === 'dark', 'fill-[#d9d9e0]': theme === 'light' })}
              />
              <div className={theme === 'dark' ? 'dark' : 'light'}>{renderPopover}</div>
            </motion.div>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </div>
  )
}
