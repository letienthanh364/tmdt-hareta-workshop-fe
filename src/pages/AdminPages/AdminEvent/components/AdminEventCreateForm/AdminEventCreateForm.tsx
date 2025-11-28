import classNames from 'classnames'
import { Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import AdminInputErrorSection from 'src/components/AdminInputErrorSection'
import CustomJoditEditor from 'src/components/CustomJoditEditor'
import DateSelect from 'src/components/DateSelect'
import InputNumber from 'src/components/InputNumber'
import { CreateEventSchema } from 'src/rules/adminevent.rule'
import AdminTextArea from '../AdminTextArea'

type FormData = CreateEventSchema

export default function AdminEventCreateForm() {
  //! Use form context
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<FormData>()

  //! STYLES
  const inputFieldStyle = 'grid grid-cols-4 items-center gap-2 py-1 px-2 bg-transparent'
  const titleStyle = 'text-xs tablet:text-sm space-x-2 uppercase col-span-1 desktop:text-base text-primaryBlue'
  const inputStyle =
    'text-darkText py-1 px-2 col-span-3 text-base lg:text-lg rounded-lg outline-none outline-offset-2 focus:outline-haretaColor bg-white font-medium'
  const starStyle = 'text-lg text-alertRed tablet:text-xl desktop:text-2xl'

  //! Text editor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setDetailEditorContent = (editorState: any) => {
    setValue('detail_content', editorState)
  }
  const detailEditorContent = watch('detail_content')

  return (
    <Fragment>
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
    </Fragment>
  )
}
