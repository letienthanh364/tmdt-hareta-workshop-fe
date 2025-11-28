import { formatDate } from 'src/utils/utils'

interface Props {
  title: string
  infor: string | number
  isDate?: boolean
  wrapperStyle?: string
  titleWrapperStyle?: string
  contentWrapperStyle?: string
  titleStyle?: string
  contentStyle?: string
}

export default function AdminInforSection({
  title,
  infor,
  isDate = false,
  wrapperStyle,
  titleWrapperStyle,
  contentWrapperStyle,
  titleStyle,
  contentStyle
}: Props) {
  //! STYLES
  const wrapperClassname = wrapperStyle || 'grid grid-cols-3 text-sm items-center gap-4'
  const titleWrapperClassname = titleWrapperStyle || 'col-span-1'
  const contentWrapperClassname = contentWrapperStyle || 'col-span-2'
  const titleClassname = titleStyle || 'font-medium uppercase text-white/60'
  const contentClassname = contentStyle || 'rounded-lg bg-darkColor900 px-2 py-1 text-haretaColor'

  return (
    <div className={wrapperClassname}>
      <div className={titleWrapperClassname}>
        <p className={titleClassname}>{title}</p>
      </div>
      <div className={contentWrapperClassname}>
        <div className={contentClassname}>{isDate ? formatDate(infor as string) : infor}</div>
      </div>
    </div>
  )
}
