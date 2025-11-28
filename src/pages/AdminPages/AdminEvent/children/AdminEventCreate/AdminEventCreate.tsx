import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { reject } from 'lodash'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { imageApi } from 'src/apis/image.api'
import { HttpStatusMessage } from 'src/constants/httpStatusMessage'
import { adminPath } from 'src/constants/path'
import { CreateEventSchema, createEventSchema } from 'src/rules/adminevent.rule'
import { Image } from 'src/types/image.type'
import { ErrorRespone, SuccessRespone } from 'src/types/utils.type'
import { formatTimeToSeconds, generateNameId, isAxiosBadRequestError } from 'src/utils/utils'
import AdminEventCreateForm from '../../components/AdminEventCreateForm'
import DialogPopup from 'src/components/DialogPopup'
import LoadingRing from 'src/components/LoadingRing'
import InputFile from 'src/components/InputFile'
import { EventType } from 'src/types/event.type'
import { eventQuery } from 'src/hooks/queries/useEventQuery'

type FormData = CreateEventSchema

const currentDate = new Date()

export default function AdminEventCreate() {
  const [excutingDialog, setExcutingDialog] = useState<boolean>(false)
  const [excuting, setExcuting] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorUploadImage, setErrorUploadImage] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successDialog, setSuccessDialog] = useState<boolean>(false)

  const [createdEvent, setCreatedEvent] = useState<EventType | null>(null)

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
  const [dateStart, setDateStart] = useState<Date>(currentDate)
  const [dateEnd, setDateEnd] = useState<Date>(currentDate)

  const methods = useForm<FormData>({
    defaultValues: {
      overall_content: '',
      detail_content: '',
      date_start: currentDate,
      date_end: currentDate,
      discount: 0,
      avatar: ''
    },
    resolver: yupResolver(createEventSchema)
  })
  const { handleSubmit, reset, setValue } = methods

  useEffect(() => {
    setValue('date_start', dateStart)
  }, [dateStart, setValue])
  useEffect(() => {
    setValue('date_end', dateEnd)
  }, [dateEnd, setValue])

  //! Handle submit form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: any) => {
    reject(errors)
  }
  const createEventMutation = eventQuery.mutation.useCreateEvent()
  const uploadImageMutation = useMutation({
    mutationFn: imageApi.uploadImage
  })

  const onSubmit = async (data: FormData) => {
    setSuccessDialog(false)
    setExcutingDialog(true)
    setExcuting(true)

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

    data.date_start.setHours(0, 0, 0, 0)
    data.date_end.setHours(23, 59, 59, 999)
    const newEventBody = {
      ...data,
      date_start: formatTimeToSeconds(data.date_start.getTime()),
      date_end: formatTimeToSeconds(data.date_end.getTime()),
      avatar: newUploadedImageRespone ? newUploadedImageRespone.data.data.url : ''
    }
    createEventMutation.mutate(newEventBody, {
      onSettled: () => {
        setExcuting(false)
        window.scrollTo({ top: 0, left: 0 })
      },
      onSuccess: ({ data: respone }) => {
        setError(false)
        setExcuting(false)
        setSuccessDialog(true)
        reset()
        setFile(undefined)
        setDateStart(currentDate)
        setDateEnd(currentDate)
        setCreatedEvent(respone.data)
      },
      onError: (error) => {
        if (isAxiosBadRequestError<ErrorRespone>(error)) {
          const formError = error.response?.data
          if (formError) {
            const responeLog = formError?.log as string
            console.log(responeLog)
            setErrorMessage(HttpStatusMessage.get(formError.error_key) || 'Lỗi không xác định')
          }
        }
        setError(true)
      }
    })
  }

  //! Success dialog
  const closeDialogAndNavigate = () => {
    setSuccessDialog(false)
    if (createdEvent)
      navigate(
        {
          pathname: `${adminPath.events}/${generateNameId({ name: createdEvent.overall_content, id: createdEvent.id })}`
        },
        { state: { from: 'AdminEventCreate' } }
      )
  }
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
                  buttonClassname={
                    'flex py-1 px-6 tablet:px-8 desktop:px-10 hover:bg-hoveringBg cursor-pointer items-center justify-center rounded-md text-sm font-medium  bg-black/60 text-white hover:text-darkText'
                  }
                  buttonTitle='Chọn ảnh từ máy'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form className='mt-4 space-y-4' onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <AdminEventCreateForm />
          <div className='col-span-1 mt-2 flex items-center justify-end'>
            <button
              className='lg:text-lg rounded-lg bg-haretaColor/80 bg-unhoveringBg px-4 py-1 text-base hover:bg-hoveringBg'
              type='submit'
            >
              Tạo sự kiện
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
                {!errorUploadImage && (
                  <p className='text-center text-xl font-medium uppercase leading-6 text-alertRed'>{errorMessage}</p>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </DialogPopup>

      <DialogPopup isOpen={successDialog} handleClose={closeDialogAndNavigate}>
        <div className='space-y-6'>
          <p className='text-center text-xl font-medium uppercase leading-6 text-successGreen'>
            Đã tạo sự kiện thành công
          </p>
          <button
            onClick={closeDialogAndNavigate}
            className='desktop:tetx-base rounded-xl bg-unhoveringBg px-6 py-2 text-sm hover:bg-hoveringBg'
          >
            Thêm sản phẩm vào sự kiện
          </button>
        </div>
      </DialogPopup>
    </div>
  )
}
