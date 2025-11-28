import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { Fragment, useContext } from 'react'
import productApi from 'src/apis/product.api'
import LoadingRing from 'src/components/LoadingRing'
import { AdminContext } from 'src/contexts/admin.context'
import { InformationField } from 'src/types/utils.type'

function InforSection({ title, infor }: { title: string; infor: string | number }) {
  //! STYLES
  const wrapperClassname = 'grid grid-cols-12 items-center gap-4 text-lg'
  const titleWrapperClassname = 'col-span-2'
  const contentWrapperClassname = 'col-span-10'
  const titleClassname = 'font-medium text-primaryBlue uppercase'
  const contentClassname =
    'rounded-lg bg-darkColor900 px-2 py-1 w-full tablet:w-8/12 desktop:w-6/12 capitalize text-haretaColor'

  return (
    <div className={wrapperClassname}>
      <div className={titleWrapperClassname}>
        <p className={titleClassname}>{title}</p>
      </div>
      <div className={contentWrapperClassname}>
        <div className={contentClassname}>{infor}</div>
      </div>
    </div>
  )
}

export default function AdminProductInfor() {
  const { currentProduct } = useContext(AdminContext)

  //! GET CURRENT PRODUCT DETAIL
  const productId = currentProduct?.id
  const { data: productDetailData } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productApi.getProductDetail(productId as string),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(currentProduct)
  })
  const productDetail = productDetailData?.data.data
  const avatarURL = productDetail?.avatar ? productDetail.avatar.url : null

  //! STYLES
  const wrapperClassname = 'grid grid-cols-12 items-center gap-4 text-lg'
  const titleWrapperClassname = 'col-span-2'
  const contentWrapperClassname = 'col-span-10'
  const titleClassname = 'font-medium text-primaryBlue uppercase'

  if (!currentProduct) return <div className='h-full text-xl font-semibold uppercase'>Hãy chọn một sản phẩm</div>

  //! Infos
  const infos: InformationField[] = [
    {
      title: 'Nhóm sản phẩm',
      info: productDetail?.group.name ?? ''
    },
    {
      title: 'ID',
      info: productDetail?.id ?? ''
    },
    {
      title: 'Tên sản phẩm',
      info: productDetail?.name ?? ''
    },
    {
      title: 'Màu',
      info: productDetail?.color ?? ''
    },
    {
      title: 'Hạng mục',
      info: productDetail?.category ?? ''
    },
    {
      title: 'Bộ sưu tập',
      info: productDetail?.collection ?? ''
    },
    {
      title: 'Loại',
      info: productDetail?.type ?? ''
    },
    {
      title: 'Dòng sản phẩm',
      info: productDetail?.product_line ?? ''
    },
    {
      title: 'Số lượng',
      info: productDetail?.quantity ?? ''
    },
    {
      title: 'Giá',
      info: productDetail?.price ?? ''
    },
    {
      title: 'Giảm giá',
      info: productDetail?.discount ?? ''
    },
    {
      title: 'Tag',
      info: productDetail?.tag ?? ''
    },
    {
      title: 'Lượt thích',
      info: productDetail?.like_count ?? ''
    },
    {
      title: 'Đã bán',
      info: productDetail?.sold ?? ''
    },
    {
      title: 'cron status',
      info: productDetail?.cron_status ?? ''
    }
  ]

  return (
    <div className='flex min-h-[200px] items-center justify-center rounded-lg border border-white/40'>
      {currentProduct && (
        <Fragment>
          {!productDetail && <LoadingRing />}

          {productDetail && (
            <div className='space-y-4 px-2 py-4 desktop:space-y-6'>
              <div className={wrapperClassname}>
                <div className={titleWrapperClassname}>
                  <p className={titleClassname}>Ảnh đại diện</p>
                </div>
                <div className={contentWrapperClassname}>
                  <div className=' w-6/12 desktop:w-8/12'>
                    <div className='relative w-full overflow-hidden pt-[75%]'>
                      <img
                        src={avatarURL ?? ''}
                        alt={`${productDetail.name} ${productDetail.color}`}
                        className='absolute left-0 top-0 h-full w-full object-scale-down'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {infos.map((info, index) => (
                <InforSection key={index} title={info.title} infor={info.info} />
              ))}

              <div className='text-lg'>
                <p className={titleClassname}>Mô tả</p>
                <div className='py-1 text-sm tablet:text-base desktop:text-lg'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(productDetail.description)
                    }}
                    className='overflow-visible'
                  />
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  )
}
