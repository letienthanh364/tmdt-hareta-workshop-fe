import { useState } from 'react'
import { Image } from 'src/types/image.type'

export default function ImageCard({ image, handleCopy }: { image: Image; handleCopy: (url: string) => () => void }) {
  const [hovering, setHovering] = useState<boolean>(false)

  return (
    <button
      className='relative w-full overflow-hidden rounded-md border border-white/40 pt-[75%] hover:border-haretaColor'
      onMouseEnter={() => setHovering(true)}
      onClick={handleCopy(image.url)}
      onMouseLeave={() => setHovering(false)}
    >
      <img src={image.url} alt='Error URL' className='absolute left-0 top-0 h-full w-full object-scale-down' />
      {hovering && (
        <div className='absolute bottom-1 left-1/2 flex w-10/12 -translate-x-1/2 items-center space-x-1 rounded-md bg-black/80 px-2 py-1 text-xs text-white'>
          <p className='overflow-hidden'>{image.url}</p>
        </div>
      )}
      {/* <button
        className='absolute right-1 top-1 rounded-md bg-unhoveringBg px-3 py-1 text-sm hover:bg-hoveringBg'
      >
        Sao chép URL
      </button> */}
    </button>
  )
}
