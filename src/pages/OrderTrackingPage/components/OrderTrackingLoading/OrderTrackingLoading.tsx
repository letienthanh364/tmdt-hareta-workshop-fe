import { ColorRing } from 'react-loader-spinner'

export default function OrderTrackingLoading() {
  return (
    <div className='flex h-80 items-center justify-center'>
      <ColorRing
        visible={true}
        height='80'
        width='80'
        ariaLabel='blocks-loading'
        wrapperStyle={{}}
        wrapperClass='blocks-wrapper'
        colors={['#ff6a00', '#ff6a00', '#ff6a00', '#ff6a00', '#ff6a00']}
      />
    </div>
  )
}
