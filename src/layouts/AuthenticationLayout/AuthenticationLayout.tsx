import { useContext } from 'react'
import Footer from 'src/components/MainFooter'
import RegisterHeader from 'src/components/RegisterHeader'
import { AppContext } from 'src/contexts/app.context'
interface Props {
  children?: React.ReactNode
}

export default function AuthenticationLayout({ children }: Props) {
  const { theme } = useContext(AppContext)
  return (
    <div
      className='min-h-screen bg-cover bg-center duration-200 '
      style={{
        backgroundImage: `url(${theme === 'dark' ? './images/background-light.png' : './images/background-dark.png'})`
      }}
    >
      <RegisterHeader />

      <div className='min-h-screen pt-10 tabletSmall:pt-12 desktop:pt-16'>{children}</div>
      <Footer />
    </div>
  )
}
