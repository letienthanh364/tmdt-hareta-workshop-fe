import { useViewport } from 'src/hooks/useViewport'
import { Fragment } from 'react'
import FooterDesktop from './children/FooterDesktop'
import FooterMobile from './children/FooterMobile'

export default function MainFooter() {
  const viewPort = useViewport()
  const isMobile = viewPort.width <= 768
  return (
    <Fragment>
      {!isMobile && <FooterDesktop />}
      {isMobile && <FooterMobile />}
    </Fragment>
  )
}
