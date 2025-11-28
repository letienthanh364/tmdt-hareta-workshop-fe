import { Skeleton } from '@mui/material'

export default function UserProfileSekeleton() {
  return (
    <div className='relative mx-2 my-12 rounded-lg bg-lightBg p-2 dark:bg-darkBg desktop:mx-8 desktop:my-16 desktop:p-4'>
      <div className='relative -top-4 flex items-center justify-between desktop:-top-10'>
        <div className='flex w-full items-center'>
          <div className='relative h-20 w-20 overflow-hidden rounded-full border-[5px] border-[#f8f8f8] dark:border-[#181818] desktop:h-32 desktop:w-32'>
            <Skeleton
              variant='rounded'
              className='absolute left-0 top-0 object-cover dark:bg-white/10'
              width={'100%'}
              height={'100%'}
            />
          </div>

          <div className='ml-2 flex grow flex-col space-y-1 tabletSmall:ml-4 desktop:ml-8'>
            <Skeleton width={'50%'} height={40} className=' dark:bg-white/10' />
            <p className='truncate text-xs text-darkText/60 dark:text-lightText/60 tabletSmall:text-sm desktop:text-base'>
              <Skeleton className=' dark:bg-white/10' width={'20%'} />
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-2 rounded-lg bg-[#e8e8e8] px-6 py-4 dark:bg-[#202020] '>
        <div className=''>
          <p className=' text-base uppercase text-darkText/60 dark:text-lightText/60 desktop:text-lg'>Name</p>
          <div>
            <Skeleton width={'50%'} height={40} className=' dark:bg-white/10' />
            <div className='mt-1 min-h-[1.25rem]'></div>
          </div>
        </div>
        <div className=''>
          <p className=' text-base uppercase text-darkText/60 dark:text-lightText/60 desktop:text-lg'>Phone number</p>
          <div>
            <Skeleton width={'50%'} height={40} className=' dark:bg-white/10' />
            <div className='mt-1 min-h-[1.25rem]'></div>
          </div>
        </div>
        <div className=''>
          <p className=' text-base uppercase text-darkText/60 dark:text-lightText/60 desktop:text-lg'>email</p>
          <Skeleton width={'50%'} height={40} className=' dark:bg-white/10' />
        </div>
      </div>
    </div>
  )
}
