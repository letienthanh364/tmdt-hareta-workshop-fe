import StoreMobileSorter from '../StoreMobileSorter'
import StoreMobileFilter from '../StoreMobileFilter'
import { ProductListQueryConfig } from 'src/hooks/useProductListQueryConfig'

interface Props {
  queryConfig: ProductListQueryConfig
}

export default function StoreMobileBottomBar({ queryConfig }: Props) {
  return (
    <div className='fixed bottom-0 z-10 grid h-10 w-full grid-cols-2 items-center justify-between border-t border-black/20 bg-lightHeader px-2 duration-200 dark:border-white/20 dark:bg-darkHeader tabletSmall:h-12'>
      <div className='col-span-1 flex items-center justify-start'>
        <StoreMobileSorter />
      </div>
      <div className='col-span-1 flex items-center justify-end'>
        <StoreMobileFilter queryConfig={queryConfig} />
      </div>
    </div>
  )
}
