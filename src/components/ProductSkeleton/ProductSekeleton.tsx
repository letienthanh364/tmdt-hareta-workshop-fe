import Skeleton from '@mui/material/Skeleton'

export default function ProductSekeleton() {
  return (
    <div className='flex w-full items-center justify-center pb-0 pt-2 duration-200 hover:pb-2 hover:pt-0'>
      <div className='relative  w-full rounded-xl bg-productLightBg pb-4 duration-200 dark:bg-productDarkBg'>
        <div className='relative w-full pt-[80%]'>
          <Skeleton className='absolute left-0 top-0' width='100%' height='100%' variant='rectangular' />
        </div>
        <div className='mx-3 mt-4 flex w-full justify-between space-x-1 overflow-hidden'>
          <div className='flex w-full flex-col justify-between space-y-1 overflow-hidden'>
            <Skeleton variant='rounded' width='50%' />
            <div className='flex w-full items-center space-x-4 py-1'>
              <Skeleton variant='rounded' width='20%' />

              <Skeleton variant='rounded' width='20%' />
            </div>
            <Skeleton width='20%' />
          </div>
        </div>
      </div>
    </div>
  )
}
