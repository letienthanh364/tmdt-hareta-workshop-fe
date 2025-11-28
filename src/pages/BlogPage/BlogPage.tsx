import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PathBar from 'src/components/PathBar'
import SearchBar from 'src/components/SearchBar'
import mainPath from 'src/constants/path'
import BlogSorter from './components/BlogSorter'
import { useQuery } from '@tanstack/react-query'
import blogApi from 'src/apis/blog.api'
import useBlogListQueryConfig, { BLOG_LIMIT } from 'src/hooks/useBlogListQueryConfig'
import LoadingSection from 'src/components/LoadingSection'
import BlogCard from './components/BlogCard'
import UsePagination from 'src/components/UsePagination'
import { ceil, omit } from 'lodash'
import { createSearchParams, useNavigate } from 'react-router-dom'

export default function BlogPage() {
  //! Multi languages
  const { t } = useTranslation('blog')

  //! Change title
  useEffect(() => {
    document.title = `${t('title')} | Hareta Workshop`
  })

  //! Get blog list
  const blogListQueryConfig = useBlogListQueryConfig()
  const { title } = blogListQueryConfig
  const { data: blogsData } = useQuery({
    queryKey: ['blogs', blogListQueryConfig],
    queryFn: () => blogApi.getBlogList(blogListQueryConfig)
  })

  //! Handle search
  const navigate = useNavigate()
  const handleSearch = (keyWord: string) => {
    if (keyWord == '') {
      navigate({
        pathname: mainPath.blogs
      })
    } else {
      navigate({
        pathname: mainPath.blogs,
        search: createSearchParams({
          title: keyWord
        }).toString()
      })
    }
  }

  const clearSearch = () => {
    navigate({
      pathname: mainPath.blogs,
      search: createSearchParams(
        omit(
          {
            ...blogListQueryConfig
          },
          ['title', 'page', 'limit']
        )
      ).toString()
    })
  }

  //! Handle sorting
  const { tag: activeTag } = blogListQueryConfig
  const handleChooseTag = (tag: string) => () => {
    if (tag == activeTag) {
      navigate({
        pathname: mainPath.blogs,
        search: createSearchParams(
          omit(
            {
              ...blogListQueryConfig
            },
            ['tag', 'page', 'limit']
          )
        ).toString()
      })
    } else {
      navigate({
        pathname: mainPath.blogs,
        search: createSearchParams(
          omit(
            {
              ...blogListQueryConfig,
              tag: tag
            },
            ['page', 'limit']
          )
        ).toString()
      })
    }
  }

  return (
    <div className='bg-lightBg py-2 pb-12 duration-200 dark:bg-darkBg tablet:py-3 tablet:pb-16 desktop:py-4 desktop:pb-20'>
      <div className='container space-y-4'>
        <PathBar pathList={[{ pathName: t('path.blog'), url: mainPath.blogs }]} />

        <h1 className='text-center text-lg font-bold uppercase leading-10 tracking-wide tablet:text-2xl desktop:text-4xl'>
          {t('title')}
        </h1>

        <div className='grid w-full grid-cols-1 gap-4 tablet:grid-cols-2 tablet:gap-6 desktop:grid-cols-3 desktop:gap-8'>
          <div className='col-span-1 space-y-2'>
            <SearchBar handleSearch={handleSearch} />
            {title && (
              <div className='relative rounded-xl bg-lightColor900 px-4 py-2 dark:bg-darkColor900'>
                <p className='tablet:text-lg desktop:text-xl'>{`"${title}"`}</p>
                <button
                  onClick={clearSearch}
                  className='absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-2 text-xs capitalize text-alertRed/80 hover:text-alertRed desktop:text-sm'
                >
                  {t('list.Clear')}
                </button>
              </div>
            )}
          </div>
          <div className='col-span-1 desktop:col-span-2'>
            <BlogSorter />
          </div>
        </div>

        <div className='flex w-full items-center justify-center py-2'>
          <div className='w-1/2 border-t border-black dark:border-white'></div>
        </div>

        <div className='py-4'>
          {!blogsData && <LoadingSection />}
          {blogsData && (
            <div className='grid w-full grid-cols-1 gap-2 tablet:grid-cols-2 tablet:gap-4 desktop:grid-cols-3 desktop:gap-6'>
              {blogsData.data.data.map((blog) => (
                <div key={blog.id} className='col-span-1'>
                  <BlogCard blog={blog} handleChooseTag={handleChooseTag} />
                </div>
              ))}
            </div>
          )}
        </div>

        {blogsData && (
          <UsePagination queryConfig={blogListQueryConfig} totalPage={ceil(blogsData.data.paging.total / BLOG_LIMIT)} />
        )}
      </div>
    </div>
  )
}
