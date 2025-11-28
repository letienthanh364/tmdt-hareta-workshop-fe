import { useContext, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CreateProductSchema } from '../../../../../rules/adminproduct.rule'
import InputNumber from 'src/components/InputNumber'
import classNames from 'classnames'
import { AdminContext } from 'src/contexts/admin.context'
import AdminInputErrorSection from 'src/components/AdminInputErrorSection'
import CustomJoditEditor from 'src/components/CustomJoditEditor'
import { InputField } from 'src/types/utils.type'
import AdminInput from '../../../components/AdminInput'

type FormData = CreateProductSchema

export default function AdminProductCreateForm() {
  const { productGroup, currentProduct } = useContext(AdminContext)
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<FormData>()

  //? EDIT DESCRIPTION
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEditorStateChange = (editorState: any) => {
    setValue('description', editorState)
  }

  const editorContent = watch('description')

  //! GET PRODUCT GROUP DATA
  useEffect(() => {
    setValue('name', productGroup?.name || '')
    setValue('group_id', productGroup?.id || '')
    setValue('category', currentProduct?.category || '')
    setValue('collection', currentProduct?.collection || '')
    setValue('product_line', currentProduct?.product_line || '')
    setValue('type', currentProduct?.type || '')
  }, [currentProduct, productGroup, setValue])

  //! Fields
  const textFields: InputField[] = [
    {
      error: errors.name,
      errorMessage: errors.name?.message,
      name: 'name',
      title: 'Tên sản phẩm'
    },
    {
      error: errors.color,
      errorMessage: errors.color?.message,
      name: 'color',
      title: 'Màu'
    },
    {
      error: errors.category,
      errorMessage: errors.category?.message,
      name: 'category',
      title: 'Hạng mục'
    },
    {
      error: errors.collection,
      errorMessage: errors.collection?.message,
      name: 'collection',
      title: 'Bộ sưu tập'
    },
    {
      error: errors.type,
      errorMessage: errors.type?.message,
      name: 'type',
      title: 'Loại'
    },
    {
      error: errors.product_line,
      errorMessage: errors.product_line?.message,
      name: 'product_line',
      title: 'Dòng sản phẩm'
    }
  ]

  //! STYLES
  const inputFieldStyle = 'grid grid-cols-4 items-center gap-2 py-1 px-2 bg-transparent'
  const titleStyle = 'text-xs tablet:text-sm space-x-2 uppercase col-span-1 desktop:text-base text-primaryBlue'
  const inputStyle =
    'text-darkText py-1 px-2 col-span-3 text-base lg:text-lg rounded-lg outline-none outline-offset-2 focus:outline-haretaColor bg-white font-medium'
  const noSelectedInputStyle =
    'text-lightText py-1 px-2 col-span-2 text-base font-medium desktop:text-lg bg-transparent rounded-lg'
  const starStyle = 'text-lg text-alertRed tablet:text-xl desktop:text-2xl'

  return (
    <div className='w-full space-y-2 px-10'>
      <div className={inputFieldStyle}>
        <div className='col-span-1'>
          <p className={titleStyle}>Nhóm sản phẩm</p>
        </div>
        <p className={noSelectedInputStyle}>{productGroup?.name}</p>
      </div>

      <div className={inputFieldStyle}>
        <div className='col-span-1'>
          <p className={titleStyle}>ID nhóm sản phẩm</p>
        </div>
        <p className={noSelectedInputStyle}>{productGroup?.id}</p>
      </div>

      {textFields.map((field) => (
        <AdminInput
          key={field.name}
          className={inputFieldStyle}
          inputClassName={classNames(field.readonly ? noSelectedInputStyle : inputStyle, {
            'outline-alertRed': Boolean(field.error)
          })}
          register={register}
          name={field.name}
          readOnly={field.readonly}
          errorSection={<AdminInputErrorSection errorMessage={field.errorMessage} />}
        >
          <div className={titleStyle}>
            <span className=''>{field.title}</span>
            <span className={starStyle}>*</span>
          </div>
        </AdminInput>
      ))}

      <div className={inputFieldStyle}>
        <div className={titleStyle}>
          <span className=''>Số lượng</span>
          <span className={starStyle}>*</span>
        </div>
        <div className={'col-span-3'}>
          <Controller
            control={control}
            name='quantity'
            render={({ field }) => (
              <InputNumber
                inputClassName={classNames(inputStyle, {
                  'outline-alertRed': Boolean(errors.quantity)
                })}
                errorClassName='hidden'
                autoComplete='false'
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <AdminInputErrorSection errorMessage={errors.quantity?.message} />
      </div>

      <div className={inputFieldStyle}>
        <div className={titleStyle}>
          <span className=''>Giá gốc</span>
          <span className={starStyle}>*</span>
        </div>
        <div className={'col-span-3'}>
          <Controller
            control={control}
            name='original_price'
            render={({ field }) => (
              <InputNumber
                inputClassName={classNames(inputStyle, {
                  'outline-alertRed': Boolean(errors.original_price)
                })}
                errorClassName='hidden'
                autoComplete='false'
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <AdminInputErrorSection errorMessage={errors.original_price?.message} />
      </div>

      <div className={inputFieldStyle}>
        <div className={titleStyle}>
          <span className=''>Giá ưu đãi hiện tại</span>
          <span className={starStyle}>*</span>
        </div>
        <div className={'col-span-3'}>
          <Controller
            control={control}
            name='price'
            render={({ field }) => (
              <InputNumber
                inputClassName={classNames(inputStyle, {
                  'outline-alertRed': Boolean(errors.price)
                })}
                errorClassName='hidden'
                autoComplete='false'
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <AdminInputErrorSection errorMessage={errors.price?.message} />
      </div>

      <div className='space-y-2 px-2 py-1 text-black'>
        <div className={titleStyle}>
          <span className='text-lg'>Mô tả</span>
          <span className={starStyle}>*</span>
        </div>

        <CustomJoditEditor content={editorContent} setContent={onEditorStateChange} />
      </div>
    </div>
  )
}
