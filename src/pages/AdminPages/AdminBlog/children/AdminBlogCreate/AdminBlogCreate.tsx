import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Fragment, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { imageApi } from 'src/apis/image.api'
import DialogPopup from 'src/components/DialogPopup'
import LoadingRing from 'src/components/LoadingRing'
import { Image } from 'src/types/image.type'
import { ErrorRespone, SuccessRespone } from 'src/types/utils.type'
import { generateNameId, isAxiosBadRequestError } from 'src/utils/utils'
import InputFile from 'src/components/InputFile'
import { reject } from 'lodash'
import blogApi from 'src/apis/blog.api'
import { CreateBlogSchema, createBlogSchema } from 'src/rules/adminblog.rule'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import { useNavigate } from 'react-router-dom'
import { adminPath } from 'src/constants/path'
import AdminBlogCreateForm from '../../components/AdminBlogCreateForm'

type FormData = CreateBlogSchema

export default function AdminBlogCreate() {
  const [excutingDialog, setExcutingDialog] = useState<boolean>(false)
  const [excuting, setExcuting] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorUploadImage, setErrorUploadImage] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const navigate = useNavigate()

  //! Handle avatar
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  //! Form methods
  const methods = useForm<FormData>({
    defaultValues: {
      title: '',
      content: '',
      avatar: ''
    },
    resolver: yupResolver(createBlogSchema)
  })
  const { handleSubmit, reset } = methods

  //! Handle submit form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: any) => {
    reject(errors)
  }
  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: blogApi.createBlog
  })
  const uploadImageMutation = useMutation({
    mutationFn: imageApi.uploadImage
  })

  const onSubmit = async (data: FormData) => {
    setExcutingDialog(true)
    setExcuting(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let newUploadedImageRespone: AxiosResponse<SuccessRespone<Image>, any> | null = null
      if (file) {
        const uploadImageBody = {
          file: file
        }
        newUploadedImageRespone = await uploadImageMutation.mutateAsync(
          { ...uploadImageBody },
          {
            onError: () => {
              setError(true)
              setErrorUploadImage(true)
            }
          }
        )
      }

      const newPostBody: FormData = {
        ...data,
        avatar: newUploadedImageRespone ? newUploadedImageRespone.data.data.url : ''
      }
      createPostMutation.mutate(newPostBody, {
        onSettled: () => {
          setExcuting(false)
          window.scrollTo({ top: 0, left: 0 })
        },
        onSuccess: ({ data: respone }) => {
          setError(false)
          reset()
          setFile(undefined)
          queryClient.invalidateQueries({ queryKey: ['blogs'] })
          navigate(
            { pathname: `${adminPath.blogs}/${generateNameId({ name: data.title, id: respone.data })}` },
            { state: { from: 'AdminBlogCreate' } }
          )
        },
        onError: (error) => {
          if (isAxiosBadRequestError<ErrorRespone>(error)) {
            const formError = error.response?.data
            if (formError) {
              setErrorMessage(HttpStatusMessage.get(formError.error_key) || 'Lỗi không xác định')
            }
          }
          setError(true)
        }
      })
    } catch (error) {
      setExcuting(false)
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          setErrorMessage(HttpStatusMessage.get(formError.error_key) || 'Lỗi không xác định')
        }
      }
      setError(true)
    }
  }

  //! Styles
  const buttonStyle =
    'flex py-1 px-6 tablet:px-8 desktop:px-10 hover:bg-hoveringBg cursor-pointer items-center justify-center rounded-md text-sm font-medium  bg-black/60 text-white hover:text-darkText'

  return (
    <div>
      <div className='grid grid-cols-4 items-center gap-2 rounded-md border border-black/20 px-2 py-1'>
        <div className='col-span-1'>
          <p className='lg:text-base text-xs font-semibold uppercase text-primaryBlue tablet:text-sm'>Ảnh hiển thị</p>
        </div>
        <div className='col-span-3'>
          <div className='flex w-full flex-col items-center space-y-4 py-4 tabletSmall:w-8/12 tablet:w-6/12 desktop:w-4/12'>
            <div className='relative w-full overflow-hidden rounded-md border-2 pt-[100%]'>
              {previewImage && (
                <img src={previewImage} alt='ảnh' className='absolute left-0 top-0 h-full w-full object-cover ' />
              )}
              {!previewImage && <div className='absolute left-0 top-0 h-full w-full bg-white/60'></div>}
              <div className='absolute bottom-1 left-1/2 flex w-full -translate-x-1/2 justify-center'>
                <InputFile
                  onChangeImageFile={handleChangeFile}
                  buttonClassname={buttonStyle}
                  buttonTitle='Chọn ảnh từ máy'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form className='mt-4 space-y-4' onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <AdminBlogCreateForm />
          <div className='col-span-1 mt-2 flex items-center justify-end'>
            <button
              className='lg:text-lg rounded-lg bg-haretaColor/80 bg-unhoveringBg px-4 py-1 text-base hover:bg-hoveringBg'
              type='submit'
            >
              Tạo bài viết
            </button>
          </div>
        </form>
      </FormProvider>
      <DialogPopup
        isOpen={excutingDialog}
        handleClose={() => {
          setExcutingDialog(false)
        }}
      >
        {excuting && <LoadingRing />}
        {!excuting && (
          <Fragment>
            {!error && (
              <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>
                Đã tạo bài viết thành công
              </p>
            )}
            {error && (
              <Fragment>
                {errorUploadImage && (
                  <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>
                    Không thể tải ảnh lên
                  </p>
                )}
                {!errorUploadImage && errorMessage == '' && (
                  <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>
                    Đã có lỗi xảy ra, vui lòng thử lại sau
                  </p>
                )}
                {!errorUploadImage && errorMessage != '' && (
                  <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>{errorMessage}</p>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </DialogPopup>
    </div>
  )
}
