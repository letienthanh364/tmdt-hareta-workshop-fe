import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import { imageApi } from 'src/apis/image.api'
import DialogPopup from 'src/components/DialogPopup'
import LoadingRing from 'src/components/LoadingRing'
import { adminPath } from 'src/constants/path'
import useImageListQueryConfig, { ImageListQueryConfig } from 'src/hooks/useImageListQueryConfig'
import { UpdateBlogSchema, updateBlogSchema } from 'src/rules/adminblog.rule'
import { Image, ImageListConfig } from 'src/types/image.type'
import { ErrorRespone, SuccessRespone } from 'src/types/utils.type'
import { formatTimeToSeconds, getIdFromNameId, isAxiosBadRequestError } from 'src/utils/utils'
import AdminBlogInfo from '../../components/AdminBlogInfo'
import AdminBlogUpdateForm from '../../components/AdminBlogUpdateForm'

type FormData = UpdateBlogSchema

export default function AdminBlogDetail() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  //! Use state
  const [editingMode, setEditingMode] = useState<boolean>(false)
  const [updateExcutingDialog, setUpdateExcutingDialog] = useState<boolean>(false)
  const [excuting, setExcuting] = useState<boolean>(false)
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [deleteExcutingDialog, setDeleteExcutingDialog] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File>()
  const [imageListConfig, setImageListConfig] = useState<ImageListQueryConfig>(useImageListQueryConfig())
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const [invalidFields, setInvalidFields] = useState<string[]>([])
  const [undefinedError, setUndefinedError] = useState<boolean>(false)

  //! Get blog detail
  const { blogId: paramPostId } = useParams()
  const blogId = getIdFromNameId(paramPostId as string)
  const {
    data: blogDetailData,
    isLoading,
    isFetched
  } = useQuery({
    queryKey: ['blogs', 'detail', blogId],
    queryFn: () => blogApi.getBlogDetail(blogId as string)
  })
  const blogDetail = blogDetailData?.data.data

  //! Handler button
  const turnOnEditingMode = () => {
    setEditingMode(true)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  const turnOffEditingMode = () => {
    setEditingMode(false)
  }

  //! Handle update blog
  useEffect(() => {
    if (blogDetail) {
      const createdDate = new Date(blogDetail.created_at)
      setImageListConfig({
        ...imageListConfig,
        time_from: String(
          formatTimeToSeconds(
            new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate()).getTime()
          )
        ),
        time_to: String(
          formatTimeToSeconds(
            new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate() + 1).getTime()
          )
        )
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogDetail])

  const { data: imagesData } = useQuery({
    queryKey: ['image', 'list', imageListConfig],
    queryFn: () => {
      return imageApi.getImageList(imageListConfig as ImageListConfig)
    },
    staleTime: 3 * 60 * 1000
  })
  const imageList = imagesData?.data.data
  const avatarImage = imageList?.find((image) => image.url == blogDetail?.avatar)
  const avatarImageID = avatarImage?.id

  //! Form methods
  const methods = useForm<FormData>({
    defaultValues: {
      id: blogDetail?.id || '',
      title: blogDetail?.title || '',
      overall: blogDetail?.overall || '',
      content: blogDetail?.content || '',
      avatar: blogDetail?.avatar || 'emptyUrl'
    },
    resolver: yupResolver(updateBlogSchema)
  })
  const { handleSubmit } = methods

  const updateBlogMutation = useMutation({ mutationFn: blogApi.updateBlog })
  const uploadImageMutation = useMutation({ mutationFn: imageApi.uploadImage })
  const deleteImageMutation = useMutation({ mutationFn: imageApi.deleteImage })

  //! Validate form
  const validateForm = (form: FormData) => {
    const invalidFields = []
    for (const key in form) {
      const value: string | string[] = form[key as keyof FormData]
      if (value == '') {
        if (key == 'avatar') {
          continue
        } else invalidFields.push(key)
      }
    }
    return invalidFields
  }

  //! Handle submit form
  const onSubmit = handleSubmit(async (data) => {
    setUpdateExcutingDialog(true)
    setExcuting(true)

    const invalidFields = validateForm(data)

    if (invalidFields.length > 0) {
      setInvalidFields(invalidFields)
      setExcuting(false)
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let newUploadedImageRespone: AxiosResponse<SuccessRespone<Image>, any> | null = null
      if (imageFile) {
        if (avatarImageID) deleteImageMutation.mutate({ image_id: avatarImageID })
        const uploadImageBody = {
          file: imageFile
        }
        newUploadedImageRespone = await uploadImageMutation.mutateAsync({ ...uploadImageBody })
      }
      const updatePostBody: FormData = {
        ...data,
        avatar: newUploadedImageRespone ? newUploadedImageRespone.data.data.url : data.avatar
      }
      updateBlogMutation.mutate(updatePostBody, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['images'] })
          queryClient.invalidateQueries({ queryKey: ['blogs'] })
          setUpdateSuccess(true)
        },
        onError: () => {
          setUndefinedError(true)
        },
        onSettled: () => {
          window.scrollTo({ top: 0, left: 0 })
          setInvalidFields([])
          setEditingMode(false)
          setImageFile(undefined)
          setExcuting(false)
        }
      })
    } catch (error) {
      if (isAxiosBadRequestError<ErrorRespone>(error)) {
        const formError = error.response?.data
        if (formError) {
          const responeLog = formError?.log as string
          console.log(responeLog)
        }
      }
    }
  })

  //! Handle delete blog
  const deleteBlogMutation = useMutation({
    mutationFn: blogApi.deleteBlog
  })
  const openDeleteDialog = () => {
    setDeleteDialog(true)
  }
  const deletePost = () => {
    setDeleteDialog(false)
    setDeleteExcutingDialog(true)
    setExcuting(true)
    if (avatarImageID) deleteImageMutation.mutate({ image_id: avatarImageID })
    if (blogDetail) deleteBlogMutation.mutate({ id: blogDetail.id })

    //:: On success
    queryClient.invalidateQueries({ queryKey: ['images'] })
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
    window.scrollTo({ top: 0, left: 0 })
    setEditingMode(false)
    setExcuting(false)
  }

  const closeDeleteExcutingDialog = () => {
    setDeleteExcutingDialog(false)
    navigate({ pathname: adminPath.blogs })
  }

  return (
    <Fragment>
      <FormProvider {...methods}>
        <form className='relative space-y-4' onSubmit={onSubmit}>
          {(isLoading || !blogDetail) && (
            <div className='flex h-[600px] w-full items-center justify-center'>
              <LoadingRing />
            </div>
          )}
          {!editingMode && (
            <div className='flex items-center justify-end'>
              <button
                type='button'
                className='rounded-md bg-unhoveringBg p-2 hover:bg-hoveringBg'
                onClick={turnOnEditingMode}
              >
                Chỉnh sửa bài viết
              </button>
            </div>
          )}

          {isFetched && (
            <Fragment>
              {blogDetail && !editingMode && <AdminBlogInfo blogDetail={blogDetail} />}
              {blogDetail && editingMode && (
                <div className='space-y-2 py-2'>
                  <AdminBlogUpdateForm blogDetail={blogDetail} imageFile={imageFile} setImageFile={setImageFile} />
                </div>
              )}
            </Fragment>
          )}
          {editingMode && (
            <div className='sticky bottom-2 z-10 flex h-min w-full items-center justify-between space-x-2 rounded-lg bg-black/60 px-4 py-2 desktop:space-x-6'>
              <div className='shrink-0 rounded-lg bg-primaryBlue p-2 font-medium desktop:text-base'>
                Chế độ chỉnh sửa
              </div>
              <div className='grid w-full grid-cols-3 gap-1'>
                <div className='col-span-1 flex items-center justify-center'>
                  <button
                    type='button'
                    className='rounded-xl border border-white/40 bg-darkColor900 px-4 py-1 text-sm text-white hover:bg-darkColor700'
                    onClick={turnOffEditingMode}
                  >
                    Hủy chỉnh sửa
                  </button>
                </div>
                <div className='col-span-1 flex items-center justify-center'>
                  <button
                    type='button'
                    className={classNames('rounded-md bg-alertRed/80  px-4 py-1 text-sm hover:bg-alertRed', {})}
                    onClick={openDeleteDialog}
                  >
                    Xóa bài viết
                  </button>
                </div>
                <div className='col-span-1 flex items-center justify-center'>
                  <button type='submit' className='rounded-md bg-unhoveringBg px-4 py-1 text-sm hover:bg-hoveringBg'>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormProvider>

      {/* //! FIELDS FOR DIALOG */}
      <DialogPopup
        isOpen={updateExcutingDialog}
        handleClose={() => {
          setUpdateExcutingDialog(false)
        }}
      >
        {excuting && <LoadingRing />}
        {!excuting && (
          <Fragment>
            {updateSuccess && (
              <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>
                Bài viết đã được cập nhật
              </p>
            )}
            {invalidFields.length > 0 && (
              <div className='space-y-2'>
                <p className='text-left text-lg font-medium uppercase leading-6 text-alertRed'>
                  Chỉnh sửa bài viết không thành công do các nội dung sau không hợp lệ:
                </p>
                <div className='flex flex-col items-start space-y-2'>
                  {invalidFields.map((field, index) => (
                    <span key={index} className=''>
                      - {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {undefinedError && (
              <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>
                Đã có lỗi xảy ra, vui lòng thử lại
              </p>
            )}
          </Fragment>
        )}
      </DialogPopup>

      <DialogPopup
        isOpen={deleteDialog}
        handleClose={() => {
          setDeleteDialog(false)
        }}
      >
        <div className='sapce-y-4 flex flex-col justify-between py-2'>
          <p className='text-center text-xl font-semibold uppercase leading-6 text-alertRed'>Xác nhận xóa bài viết</p>
          <div className='mt-6 flex items-center justify-between text-sm'>
            <button
              type='button'
              className='rounded-md bg-primaryBlue/80 px-4 py-1 hover:bg-primaryBlue'
              onClick={() => setDeleteDialog(false)}
            >
              Hủy
            </button>

            <button
              type='button'
              className='rounded-md bg-alertRed/80 px-4 py-1 hover:bg-alertRed'
              onClick={deletePost}
            >
              Xóa
            </button>
          </div>
        </div>
      </DialogPopup>

      <DialogPopup isOpen={deleteExcutingDialog} handleClose={closeDeleteExcutingDialog}>
        {excuting && <LoadingRing />}
        {!excuting && (
          <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>Đã xóa bài viết</p>
        )}
      </DialogPopup>
    </Fragment>
  )
}
