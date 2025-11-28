import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { Link as ScrollLink } from 'react-scroll'
import { privacyPath } from 'src/constants/path'

interface Props {
  closeMenu?: () => void
}

export default function PrivacyAndTermsSideNav({ closeMenu }: Props) {
  //! Multi languages
  const { t } = useTranslation('privacyAndTerms')

  const handleClose = () => {
    closeMenu && closeMenu()
  }

  const menus: { path: string; title: string }[] = [
    {
      path: privacyPath.ProductInformation,
      title: t('title.ProductInformation')
    },
    {
      path: privacyPath.OrderingAndPayments,
      title: t('title.OrderingAndPayments')
    },
    {
      path: privacyPath.ShippingAndDelivery,
      title: t('title.ShippingAndDelivery')
    },
    {
      path: privacyPath.ReturnsAndRefunds,
      title: t('title.ReturnsAndRefunds')
    },
    {
      path: privacyPath.ProductWarranty,
      title: t('title.ProductWarranty')
    },

    {
      path: privacyPath.IntellectualProperty,
      title: t('title.IntellectualProperty')
    },
    {
      path: privacyPath.InformationCollection,
      title: t('title.InformationCollection')
    },
    {
      path: privacyPath.UseOfInformation,
      title: t('title.UseOfInformation')
    },
    {
      path: privacyPath.DataProtection,
      title: t('title.DataProtection')
    },
    {
      path: privacyPath.SharingOfInformation,
      title: t('title.SharingOfInformation')
    },

    {
      path: privacyPath.CookiesAndTracking,
      title: t('title.CookiesAndTracking')
    },
    {
      path: privacyPath.ThirdPartyLinks,
      title: t('title.ThirdPartyLinks')
    },
    {
      path: privacyPath.ChildrenPrivacy,
      title: t('title.ChildrenPrivacy')
    },
    {
      path: privacyPath.ChangeToThePrivacyPolicy,
      title: t('title.ChangeToThePrivacyPolicy')
    },
    {
      path: privacyPath.TermAndConditions,
      title: t('title.TermAndConditions')
    }
  ]

  const navClassname =
    'flex w-full cursor-pointer items-center space-x-2 p-2 text-sm hover:bg-white dark:hover:bg-black desktop:p-3 desktop:text-base desktopLarge:p-4 desktopLarge:text-lg rounded-lg'
  const activeClassname = 'font-semibold text-primaryColor dark:text-primaryColor'
  return (
    <div className='flex flex-col overflow-auto'>
      {menus.map((item, index) => (
        <ScrollLink
          key={index}
          onClick={handleClose}
          className={navClassname}
          activeClass={activeClassname}
          to={item.path}
          spy={true}
          smooth={true}
          offset={-80}
          duration={500}
        >
          <FontAwesomeIcon icon={faChevronRight} />
          <p className='font-medium '>{item.title}</p>
        </ScrollLink>
      ))}
    </div>
  )
}
