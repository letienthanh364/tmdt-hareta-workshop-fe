import { useTranslation } from 'react-i18next'

interface Props {
  tag: number
  tailClassname?: string
  sectionClassname?: string
}

export default function ProductTag({
  tag,
  sectionClassname = ' bg-tagColor top-0 flex h-full w-16 items-center justify-center overflow-hidden  text-xs text-lightText font-medium desktop:w-20 desktop:text-sm',
  tailClassname = 'absolute left-[60px] top-0 h-full border-[12px] border-y-tagColor border-l-tagColor border-r-transparent desktop:left-[76px]'
}: Props) {
  //! use translation
  const { t } = useTranslation('productdetail')

  return (
    <div className='relative flex h-6 w-full shrink items-center'>
      <span className={sectionClassname}>
        {tag == 1 && t('tag.top seller')}
        {tag == 2 && t('tag.signature')}
        {tag == 3 && t('tag.favourite')}
      </span>
      <div className={tailClassname} />
    </div>
  )
}
