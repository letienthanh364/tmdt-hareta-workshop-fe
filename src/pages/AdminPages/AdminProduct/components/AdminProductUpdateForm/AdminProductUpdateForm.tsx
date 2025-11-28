import { Controller, useFormContext } from 'react-hook-form'
import { UpdateProductSchema } from '../../../../../rules/adminproduct.rule'
import InputNumber from 'src/components/InputNumber'
import classNames from 'classnames'
import { ProductType } from 'src/types/product.type'
import { formatDate } from 'src/utils/utils'
import CustomJoditEditor from 'src/components/CustomJoditEditor'
import AdminInputErrorSection from 'src/components/AdminInputErrorSection'
import AdminInput from '../../../components/AdminInput'
import { InformationField, InputField } from 'src/types/utils.type'

type FormData = UpdateProductSchema

type InputNameType =
  | 'id'
  | 'name'
  | 'category'
  | 'collection'
  | 'type'
  | 'color'
  | 'product_line'
  | 'description'
  | 'original_price'
  | 'price'
  | 'quantity'
  | 'discount'
  | 'tag'
  | 'like_count'
  | 'sold'
  | 'cron_status'

interface Props {
  productDetail: ProductType
}

export default function AdminProductUpdateForm({ productDetail }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<FormData>()

  //! Fields
  const infoFields: InformationField[] = [
    {
      title: 'Nhóm sản phẩm',
      info: productDetail.group.name
    },
    {
      title: 'ID',
      info: productDetail.id
    },
    {
      title: 'Ngày tạo',
      info: formatDate(productDetail.created_at)
    },
    {
      title: 'Ngày chỉnh sửa',
      info: formatDate(productDetail.updated_at)
    }
  ]

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
      title: 'Hạng mục',
      readonly: true
    },
    {
      error: errors.collection,
      errorMessage: errors.collection?.message,
      name: 'collection',
      title: 'Bộ sưu tập',
      readonly: true
    },
    {
      error: errors.type,
      errorMessage: errors.type?.message,
      name: 'type',
      title: 'Loại',
      readonly: true
    },
    {
      error: errors.product_line,
      errorMessage: errors.product_line?.message,
      name: 'product_line',
      title: 'Dòng sản phẩm',
      readonly: true
    }
  ]

  const numberFields: InputField[] = [
    {
      error: errors.quantity,
      errorMessage: errors.quantity?.message,
      name: 'quantity',
      title: 'Số lượng'
    },
    {
      error: errors.original_price,
      errorMessage: errors.original_price?.message,
      name: 'original_price',
      title: 'Giá gốc'
    },
    {
      error: errors.price,
      errorMessage: errors.price?.message,
      name: 'price',
      title: 'Giá hiện tại'
    },
    {
      error: errors.discount,
      errorMessage: errors.discount?.message,
      name: 'discount',
      title: 'Giảm giá'
    },
    {
      error: errors.tag,
      errorMessage: errors.tag?.message,
      name: 'tag',
      title: 'Tag'
    },
    {
      error: errors.like_count,
      errorMessage: errors.like_count?.message,
      name: 'like_count',
      title: 'Lượt thích'
    },
    {
      error: errors.sold,
      errorMessage: errors.sold?.message,
      name: 'sold',
      title: 'Đã bán'
    },
    {
      error: errors.cron_status,
      errorMessage: errors.cron_status?.message,
      name: 'cron_status',
      title: 'Cron status'
    }
  ]

  //! EDIT DESCRIPTION
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEditorStateChange = (editorState: any) => {
    setValue('description', editorState)
  }

  const editorContent = watch('description')

  //! STYLES
  const inputFieldStyle = 'grid grid-cols-4 items-center gap-2 py-1 px-2 bg-transparent'
  const titleStyle = 'text-xs tablet:text-sm space-x-2 uppercase col-span-1 desktop:text-base text-primaryBlue'
  const inputStyle =
    'text-darkText py-1 px-2 col-span-3 text-base lg:text-lg rounded-lg outline-none outline-offset-2 focus:outline-haretaColor bg-white font-medium'
  const noSelectedInputStyle =
    'text-lightText py-1 px-2 col-span-2 text-base font-medium desktop:text-lg bg-transparent rounded-lg'
  const starStyle = 'text-lg text-alertRed tablet:text-xl desktop:text-2xl'

  return (
    <div className='space-y-4'>
      {infoFields.map((info, index) => (
        <div key={index} className={inputFieldStyle}>
          <div className='col-span-1'>
            <p className={titleStyle}>{info.title}</p>
          </div>
          <div className='col-span-3'>
            <p className={noSelectedInputStyle}>{info.info}</p>
          </div>
        </div>
      ))}

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

      {numberFields.map((inputField) => (
        <div key={inputField.name} className={inputFieldStyle}>
          <div className={titleStyle}>
            <span className=''>{inputField.title}</span>
            <span className={starStyle}>*</span>
          </div>
          <div className={'col-span-3'}>
            <Controller
              control={control}
              name={inputField.name as InputNameType}
              render={({ field }) => (
                <InputNumber
                  inputClassName={classNames(inputStyle, {
                    'outline-alertRed': Boolean(inputField.error)
                  })}
                  errorClassName='hidden'
                  autoComplete='false'
                  {...field}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <AdminInputErrorSection errorMessage={inputField.errorMessage} />
        </div>
      ))}

      <div className='space-y-2 px-2 py-1 text-black'>
        <div className={titleStyle}>
          <span className='text-lg'>Mô tả</span>
          <span className='text-alertRed'>*</span>
        </div>

        <CustomJoditEditor content={editorContent} setContent={onEditorStateChange} />
      </div>
    </div>
  )
}
