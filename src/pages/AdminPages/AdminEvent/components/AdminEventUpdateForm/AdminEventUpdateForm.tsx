import React, { useEffect, useMemo } from 'react'
import classNames from 'classnames'
import { Controller, useFormContext } from 'react-hook-form'
import AdminInputErrorSection from 'src/components/AdminInputErrorSection'
import CustomJoditEditor from 'src/components/CustomJoditEditor'
import DateSelect from 'src/components/DateSelect'
import InputNumber from 'src/components/InputNumber'
import { UpdateEventSchema } from 'src/rules/adminevent.rule'
import { EventType } from 'src/types/event.type'
import InputFile from 'src/components/InputFile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLong } from '@fortawesome/free-solid-svg-icons'
import { formatDateVi } from 'src/utils/utils'
import AdminTextArea from '../AdminTextArea'

type FormData = UpdateEventSchema

interface Props {
  eventDetail: EventType
  imageFile: File | undefined
  setImageFile: React.Dispatch<React.SetStateAction<File | undefined>>
}

export default function AdminEventUpdateForm({ eventDetail, imageFile, setImageFile }: Props) {
  //! Use form
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useFormContext<FormData>()

  //! Set initial value
  useEffect(() => {
    if (eventDetail) {
      setValue('id', eventDetail.id)
      setValue('overall_content', eventDetail.overall_content)
      setValue('detail_content', eventDetail.detail_content)
      setValue('avatar', eventDetail.avatar)
      setValue('date_start', new Date(eventDetail.date_start))
      setValue('date_end', new Date(eventDetail.date_end))
      setValue('discount', eventDetail.discount)
    }
  }, [eventDetail, setValue])

  //! Handle avatar
  const previewImage = useMemo(() => {
    return imageFile ? URL.createObjectURL(imageFile) : ''
  }, [imageFile])
  const handleChangeFile = (file?: File) => {
    setImageFile(file)
  }

  //! Text editor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setDetailEditorContent = (editorState: any) => {
    setValue('detail_content', editorState)
  }
  const detailEditorContent = watch('detail_content')

  //! STYLES
  const wrapperStyle = 'grid grid-cols-4 items-center gap-2 border border-black/20 py-1 px-2 rounded-md'
  const inputFieldStyle = 'grid grid-cols-4 items-center gap-2 py-1 px-2 bg-transparent'
  const titleStyle = 'text-xs tablet:text-sm space-x-2 uppercase col-span-1 desktop:text-base text-primaryBlue'
  const inputStyle =
    'text-darkText py-1 px-2 col-span-3 text-base lg:text-lg rounded-lg outline-none outline-offset-2 focus:outline-haretaColor bg-white font-medium'
  const noSelectedInputStyle =
    'text-lightText py-1 px-2 col-span-2 text-base font-medium desktop:text-lg bg-transparent rounded-lg'
  const starStyle = 'text-lg text-alertRed tablet:text-xl desktop:text-2xl'
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
                  src={eventDetail.avatar}
                  alt='Event'
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
          <p className={noSelectedInputStyle}>{formatDateVi(eventDetail.created_at)}</p>
        </div>
      </div>

      <div className={wrapperStyle}>
        <div className='col-span-1'>
          <p className={titleStyle}>Ngày chỉnh sửa</p>
        </div>
        <div className='col-span-3'>
          <p className={noSelectedInputStyle}>{formatDateVi(eventDetail.updated_at)}</p>
        </div>
      </div>

      <AdminTextArea
        className={'grid grid-cols-4 items-start gap-2 bg-transparent px-2 py-1'}
        inputClassName={classNames(inputStyle, {
          'outline-alertRed': Boolean(errors.overall_content)
        })}
        register={register}
        name='overall_content'
        errorSection={<AdminInputErrorSection errorMessage={errors.overall_content?.message} />}
      >
        <div className={titleStyle}>
          <span className=''>Giới thiệu</span>
          <span className={starStyle}>*</span>
        </div>
      </AdminTextArea>

      <div className={inputFieldStyle}>
        <div className={titleStyle}>
          <span className=''>Khuyến mãi (%)</span>
          <span className={starStyle}>*</span>
        </div>
        <div className={'col-span-3'}>
          <Controller
            control={control}
            name='discount'
            render={({ field }) => (
              <InputNumber
                inputClassName={classNames(inputStyle, {
                  'outline-alertRed': Boolean(errors.discount)
                })}
                errorClassName='hidden'
                autoComplete='false'
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <AdminInputErrorSection errorMessage={errors.discount?.message} />
      </div>

      <div className={inputFieldStyle}>
        <div className={titleStyle}>
          <span className=''>Ngày bắt đầu</span>
          <span className='text-lg text-alertRed'>*</span>
        </div>
        <div className={'col-span-2'}>
          <Controller
            control={control}
            name='date_start'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_start?.message} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      <div className={inputFieldStyle}>
        <div className={titleStyle}>
          <span className=''>Ngày kết thúc</span>
          <span className='text-lg text-alertRed'>*</span>
        </div>
        <div className={'col-span-2'}>
          <Controller
            control={control}
            name='date_end'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_end?.message} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      <div className='space-y-4 px-2 text-black'>
        <div className='flex space-x-2'>
          <div className={titleStyle}>
            <span className=''>Nội dung</span>
            <span className='text-alertRed'>*</span>
          </div>
          <span className='text-sm text-alertRed'>{errors.detail_content?.message}</span>
        </div>
        <CustomJoditEditor content={detailEditorContent} setContent={setDetailEditorContent} />
      </div>
    </div>
  )
}
