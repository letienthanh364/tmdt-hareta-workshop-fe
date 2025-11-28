import { Fragment, useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChangeImageFile?: (file?: File) => void
}

export default function AdminImageInput({ onChangeImageFile }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadAvatar = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size > config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error('error file')
    } else {
      onChangeImageFile && onChangeImageFile(fileFromLocal)
    }
  }

  return (
    <Fragment>
      <input
        type='file'
        accept='.jpg,.jpeg,.png'
        className='hidden'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => ((event.target as HTMLInputElement).value = '')}
      />
      <button
        className=' flex h-full w-full cursor-pointer items-center justify-center'
        onClick={handleUploadAvatar}
        type='button'
      >
        <p className='text-xs font-semibold tablet:text-sm desktop:text-base'>Chọn hình ảnh</p>
      </button>
    </Fragment>
  )
}
