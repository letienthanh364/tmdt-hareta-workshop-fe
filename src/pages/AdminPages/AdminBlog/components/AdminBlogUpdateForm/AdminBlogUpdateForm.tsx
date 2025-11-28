import { faRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import AdminInputErrorSection from 'src/components/AdminInputErrorSection'
import CustomJoditEditor from 'src/components/CustomJoditEditor'
import InputFile from 'src/components/InputFile'
import { UpdateBlogSchema } from 'src/rules/adminblog.rule'
import { BlogDetail } from 'src/types/blog.type'
import { NoUndefinedField } from 'src/types/utils.type'
import { formatDate } from 'src/utils/utils'
import NoToolbarJoditEditor from 'src/components/NoToolbarJoditEditor'
import AdminInput from 'src/pages/AdminPages/components/AdminInput'

type FormData = NoUndefinedField<UpdateBlogSchema>

interface Props {
  blogDetail: BlogDetail
  imageFile: File | undefined
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>
}

export default function AdminBlogUpdateForm({ blogDetail, imageFile, setImageFile }: Props) {
  //! Use form
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<FormData>()

  //! Set initial value
  useEffect(() => {
    if (blogDetail) {
      setValue('id', blogDetail.id)
      setValue('title', blogDetail.title)
      setValue('avatar', blogDetail.avatar)
      setValue('content', blogDetail.content)
    }
  }, [blogDetail, setValue])

  //! Handle avatar
  const previewImage = useMemo(() => {
    return imageFile ? URL.createObjectURL(imageFile) : ''
  }, [imageFile])
  const handleChangeFile = (file?: File) => {
    setImageFile(file)
  }

  //! Editor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEditorStateChangeForContent = (editorState: any) => {
    setValue('content', editorState)
  }
  const editorContentForContent = watch('content')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEditorStateChangeForOverall = (editorState: any) => {
    setValue('overall', editorState)
  }
  const editorContentForOverall = watch('overall')

  //! Styles
  const wrapperStyle = 'grid grid-cols-4 items-center gap-2 border border-black/20 py-1 px-2 rounded-md'
  const noSelectedInputStyle = 'py-1 px-2 text-base lg:text-lg'
  const inputFieldStyle = 'grid grid-cols-4 items-center gap-2 py-1 px-2'
  const inputStyle =
    'text-darkText py-1 px-2 col-span-3 text-base lg:text-lg rounded-lg outline-none outline-offset-2 focus:outline-haretaColor bg-white font-medium'
  const titleStyle = 'text-xs tablet:text-sm font-semibold uppercase text-primaryBlue lg:text-base'
  const buttonStyle =
    'flex py-1 px-2 tablet:px-4 desktop:px-6 hover:bg-hoveringBg cursor-pointer items-center justify-center rounded-md text-xs font-semibold tablet:text-sm desktop:text-base bg-black/60 text-white hover:text-darkText'

  return (
    <div className='space-y-4'>
      <div className={wrapperStyle}>
        <div className='col-span-1'>
          <p className={titleStyle}>Ảnh</p>
        </div>
        <div className='col-span-3 grid grid-cols-9 gap-2'>
          <div className='col-span-4 flex items-center justify-center'>
            <div className='w-full space-y-4 py-4 tablet:w-10/12 desktop:w-8/12'>
              <div className='relative w-full overflow-hidden rounded-md border-2 border-white pt-[100%]'>
                <img
                  src={blogDetail.avatar}
                  alt={blogDetail.title}
                  className='absolute left-0 top-0 h-full w-full object-cover '
                />
              </div>
            </div>
          </div>
          <div className='col-span-1 flex items-center justify-center'>
            <FontAwesomeIcon icon={faRightLong} className='tablet:h-6 desktop:h-8' />
          </div>
          <div className='col-span-4 flex items-center justify-center'>
            <div className='w-full space-y-4 py-4 tablet:w-10/12 desktop:w-8/12'>
              <div className='relative w-full overflow-hidden rounded-md border-2 pt-[100%]'>
                {previewImage && (
                  <img src={previewImage} alt='ảnh' className='absolute left-0 top-0 h-full w-full object-cover ' />
                )}
                {!previewImage && <div className='absolute left-0 top-0 h-full w-full bg-white'></div>}
                <div className='absolute bottom-1 left-1/2 flex w-full -translate-x-1/2 justify-center'>
                  <InputFile
                    onChangeImageFile={handleChangeFile}
                    buttonClassname={buttonStyle}
                    buttonTitle='Chọn ảnh'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={wrapperStyle}>
        <div className='col-span-1'>
          <p className={titleStyle}>Ngày tạo</p>
        </div>
        <div className='col-span-3'>
          <p className={noSelectedInputStyle}>{formatDate(blogDetail.created_at)}</p>
        </div>
      </div>

      <div className={wrapperStyle}>
        <div className='col-span-1'>
          <p className={titleStyle}>Ngày chỉnh sửa</p>
        </div>
        <div className='col-span-3'>
          <p className={noSelectedInputStyle}>{formatDate(blogDetail.updated_at)}</p>
        </div>
      </div>

      <AdminInput
        className={inputFieldStyle}
        inputClassName={classNames(inputStyle, {
          'outline-red-600': Boolean(errors.title)
        })}
        register={register}
        name='title'
        autoComplete='false'
        errorSection={<AdminInputErrorSection errorMessage={errors.title?.message} />}
      >
        <div className={titleStyle}>
          <span className=''>Tiêu đề</span>
          <span className='text-alertRed'>*</span>
        </div>
      </AdminInput>

      <div className='space-y-4 px-2 text-black'>
        <div className='flex space-x-2'>
          <div className={titleStyle}>
            <span className=''>Giới thiệu</span>
            <span className='text-alertRed'>*</span>
          </div>
          <span className='text-sm text-alertRed'>{errors.overall?.message}</span>
        </div>
        <div className='h-20 overflow-hidden rounded-md'>
          <NoToolbarJoditEditor content={editorContentForOverall} setContent={onEditorStateChangeForOverall} />
        </div>
      </div>

      <div className='space-y-4 px-2 text-black'>
        <div className='flex space-x-2'>
          <div className={titleStyle}>
            <span className=''>Nội dung</span>
            <span className='text-alertRed'>*</span>
          </div>
          <span className='text-sm text-alertRed'>{errors.content?.message}</span>
        </div>
        <CustomJoditEditor content={editorContentForContent} setContent={onEditorStateChangeForContent} />
      </div>
    </div>
  )
}
