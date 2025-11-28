import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { Fragment, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import eventApi from 'src/apis/event.api'
import { imageApi } from 'src/apis/image.api'
import useImageListQueryConfig, { ImageListQueryConfig } from 'src/hooks/useImageListQueryConfig'
import { UpdateEventSchema, updateEventSchema } from 'src/rules/adminevent.rule'
import { EventType } from 'src/types/event.type'
import { formatTimeToSeconds } from 'src/utils/utils'
import AdminEventUpdateForm from '../../components/AdminEventUpdateForm'
import { AxiosResponse } from 'axios'
import { SuccessRespone } from 'src/types/utils.type'
import { Image, ImageListConfig } from 'src/types/image.type'
import classNames from 'classnames'
import DialogPopup from 'src/components/DialogPopup'

interface Props {
  eventDetail: EventType
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
  setUpdateSuccess: React.Dispatch<React.SetStateAction<boolean>>
  setExcuting: React.Dispatch<React.SetStateAction<boolean>>
  setInvalidFields: React.Dispatch<React.SetStateAction<string[]>>
  setUndefinedError: React.Dispatch<React.SetStateAction<boolean>>
  setUpdateExcutingDialog: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteExcutingDialog: React.Dispatch<React.SetStateAction<boolean>>
}

type FormData = UpdateEventSchema
const currentDate = new Date()

export default function AdminEventUpdate({
  eventDetail,
  setIsUpdating,
  setUpdateSuccess,
  setExcuting,
  setInvalidFields,
  setUndefinedError,
  setUpdateExcutingDialog,
  setDeleteExcutingDialog
}: Props) {
  //! Use state
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)

  const [imageFile, setImageFile] = useState<File>()
  const [imageListConfig, setImageListConfig] = useState<ImageListQueryConfig>(useImageListQueryConfig())

  const queryClient = useQueryClient()

  //! Handler button
  const turnOffEditingMode = () => {
    setIsUpdating(false)
  }

  //! Handle update event
  useEffect(() => {
    if (eventDetail) {
      const createdDate = new Date(eventDetail.created_at)
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
  }, [eventDetail])

  const { data: imagesData } = useQuery({
    queryKey: ['images', 'list', imageListConfig],
    queryFn: () => {
      return imageApi.getImageList(imageListConfig as ImageListConfig)
    },
    staleTime: 3 * 60 * 1000
  })
  const imageList = imagesData?.data.data
  const avatarImage = imageList?.find((image) => image.url == eventDetail?.avatar)
  const avatarImageID = avatarImage?.id

  //! Form methods
  const methods = useForm<FormData>({
    defaultValues: {
      id: eventDetail?.id || '',
      overall_content: eventDetail?.overall_content || '',
      detail_content: eventDetail?.detail_content || '',
      discount: eventDetail?.discount ?? '0',
      date_start: new Date(eventDetail?.date_start) || currentDate,
      date_end: new Date(eventDetail?.date_end) || currentDate,
      avatar: eventDetail?.avatar || 'emptyURL'
    },
    resolver: yupResolver(updateEventSchema)
  })
  const { handleSubmit } = methods

  //! Declare mutations
  const updateEventMutation = useMutation({ mutationFn: eventApi.updateEvent })
  const uploadImageMutation = useMutation({ mutationFn: imageApi.uploadImage })
  const deleteImageMutation = useMutation({ mutationFn: imageApi.deleteImage })

  //! Validate form
  const validateForm = (form: FormData) => {
    const invalidFields = []
    for (const key in form) {
      const value: string | number | Date = form[key as keyof FormData]
      if (value == 0) continue
      if (value == '') {
        if (key == 'avatar') {
          continue
        } else invalidFields.push(key)
      }
    }
    return invalidFields
  }

  //! Handle submit form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: any) => console.error(errors)
  const onSubmit = async (data: FormData) => {
    setUpdateExcutingDialog(true)
    setExcuting(true)

    const invalidFields = validateForm(data)

    if (invalidFields.length > 0) {
      setInvalidFields(invalidFields)
      setExcuting(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newUploadedImageRespone: AxiosResponse<SuccessRespone<Image>, any> | null = null
    if (imageFile) {
      if (avatarImageID) deleteImageMutation.mutate({ image_id: avatarImageID })
      const uploadImageBody = {
        file: imageFile
      }
      newUploadedImageRespone = await uploadImageMutation.mutateAsync({ ...uploadImageBody })
    }

    data.date_start.setHours(0, 0, 0, 0)
    data.date_end.setHours(23, 59, 59, 999)
    const updatePostBody = {
      ...data,
      date_start: formatTimeToSeconds(data.date_start.getTime()),
      date_end: formatTimeToSeconds(data.date_end.getTime()),
      avatar: newUploadedImageRespone ? newUploadedImageRespone.data.data.url : data.avatar
    }
    updateEventMutation.mutate(updatePostBody, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['images'] })
        queryClient.invalidateQueries({ queryKey: ['events'] })
        setUpdateSuccess(true)
      },
      onError: () => {
        setUndefinedError(true)
      },
      onSettled: () => {
        window.scrollTo({ top: 0, left: 0 })
        setInvalidFields([])
        setIsUpdating(false)
        setImageFile(undefined)
        setExcuting(false)
      }
    })
  }

  //! Handle delete blog
  const deleteBlogMutation = useMutation({
    mutationFn: eventApi.deleteEvent
  })
  const openDeleteDialog = () => {
    setDeleteDialog(true)
  }
  const deletePost = () => {
    setDeleteDialog(false)
    setDeleteExcutingDialog(true)
    setExcuting(true)
    if (avatarImageID) deleteImageMutation.mutate({ image_id: avatarImageID })
    if (eventDetail) deleteBlogMutation.mutate({ id: eventDetail.id })

    //:: On success
    queryClient.invalidateQueries({ queryKey: ['images'] })
    queryClient.invalidateQueries({ queryKey: ['events'] })
    window.scrollTo({ top: 0, left: 0 })
    setIsUpdating(false)
    setExcuting(false)
  }

  return (
    <Fragment>
      <FormProvider {...methods}>
        <form className='relative space-y-4' onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <div className='space-y-2 py-2'>
            <AdminEventUpdateForm eventDetail={eventDetail} imageFile={imageFile} setImageFile={setImageFile} />
          </div>
          <div className='sticky bottom-2 z-10 flex h-min w-full items-center justify-between space-x-2 rounded-lg bg-black/60 px-4 py-2 desktop:space-x-6'>
            <div
              className='shrink-0 rounded-lg bg-haretaColor
             p-2 font-medium desktop:text-base'
            >
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
                  className={classNames('rounded-xl bg-alertRed/80  px-4 py-1 text-sm hover:bg-alertRed', {})}
                  onClick={openDeleteDialog}
                >
                  Xóa
                </button>
              </div>
              <div className='col-span-1 flex items-center justify-center'>
                <button type='submit' className='rounded-xl bg-primaryBlue/80 px-4 py-1 text-sm hover:bg-primaryBlue'>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>

      <DialogPopup
        isOpen={deleteDialog}
        handleClose={() => {
          setDeleteDialog(false)
        }}
      >
        <div className='sapce-y-4 flex flex-col justify-between py-2'>
          <p className='text-center text-xl font-semibold uppercase leading-6 text-alertRed'>Xác nhận xóa sự kiện</p>
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
    </Fragment>
  )
}
