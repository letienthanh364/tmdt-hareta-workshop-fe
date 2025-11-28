import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import { adminPath } from 'src/constants/path'
import useBlogListQueryConfig from 'src/hooks/useBlogListQueryConfig'

export default function AdminBlogSorter() {
  //! Get tag list
  const { data: tagsData } = useQuery({
    queryKey: ['blogs', 'tags'],
    queryFn: () => blogApi.getBlogTagList()
  })
  const tags = tagsData?.data.data || []
  const tagList = ['Tất cả', ...tags]

  //! Handle select tag
  const blogListQueryConfig = useBlogListQueryConfig()
  const { tag } = blogListQueryConfig
  const navigate = useNavigate()
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelector } = event.target
    if (valueFromSelector == 'Tất cả') {
      navigate({
        pathname: adminPath.blogs,
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
        pathname: adminPath.blogs,
        search: createSearchParams(
          omit(
            {
              ...blogListQueryConfig,
              tag: valueFromSelector
            },
            ['page', 'limit']
          )
        ).toString()
      })
    }
  }

  return (
    <div className='flex items-center justify-center space-x-2 rounded-lg bg-darkColor700 px-6 py-2 text-darkText'>
      <span className='flex shrink-0 items-center text-lg font-semibold uppercase text-haretaColor'>Lọc theo tag:</span>

      <label className='relative w-40'>
        <span className='text-primaryText pointer-events-none absolute right-2 top-1/2 -translate-y-1/2'>
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
        <select
          onChange={handleChange}
          name='year'
          className='text-primaryText ring-primaryTextUnHover focus:ring-primaryText h-10 w-full cursor-pointer appearance-none rounded-xl px-4 outline-none ring-1 hover:border-primaryBlue focus:ring-2'
          value={tag}
        >
          <option disabled className='text-lg font-semibold uppercase'>
            Tag
          </option>
          {tagList.map((tag) => (
            <option value={tag} key={tag} className='text-darkText/80'>
              {tag}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
