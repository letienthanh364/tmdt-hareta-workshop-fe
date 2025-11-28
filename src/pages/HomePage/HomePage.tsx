import { useEffect } from 'react'
import HomeEventSlideShow from './children/HomeEventSlideShow'
import HomeNewReleaseSlideShow from './children/HomeNewReleaseSlideShow'
import HomeIntroduction from './children/HomeIntroduction'
import HomeTopSellerSlideShow from './children/HomeTopSellerSlideShow'

export default function HomePage() {
  //! CHANGE TITLE
  useEffect(() => {
    document.title = 'Hareta Workshop'
  })

  return (
    <div className='duration-200'>
      <HomeEventSlideShow />

      <div className='container space-y-10 py-8 tablet:space-y-16 desktop:space-y-12 desktop:py-20 desktopLarge:space-y-24'>
        <HomeNewReleaseSlideShow />

        <HomeTopSellerSlideShow />

        <HomeIntroduction />

        {/* <HomeFavouriteList /> */}
      </div>
    </div>
  )
}
