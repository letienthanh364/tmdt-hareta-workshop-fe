import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import blogApi from 'src/apis/blog.api'
import LoadingRing from 'src/components/LoadingRing'
import { AdminBlogContext } from 'src/contexts/adminblog.context'

interface Props {
  errorMessage?: string
  blogId: string
}

export default function AdminBlogTagEditor({ errorMessage, blogId }: Props) {
  const { updateTags, setUpdateTags } = useContext(AdminBlogContext)
  const [typedTag, setTypedTag] = useState<string>('')

  const queryClient = useQueryClient()

  //! Get tag list
  const { data: blogTagsData } = useQuery({
    queryKey: ['blogs', 'tags'],
    queryFn: () => blogApi.getBlogTagList()
  })

  //! Handle add tag
  const handleChooseTag = (tag: string) => () => {
    setTypedTag(tag)
  }

  const handleTypedTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setTypedTag(value)
  }

  const addTagMutation = useMutation({ mutationFn: blogApi.addTagForBlog })
  const addTag = (tag: string) => {
    const testTag = tag.replace(/\s/g, '')
    if (tag == '' || testTag == '') {
      setTypedTag('')
      return
    }
    const newTag = tag
    tag.toLowerCase()
    const checkingTags = updateTags
    checkingTags.forEach((tag) => tag.toLowerCase())
    if (!checkingTags.includes(tag)) {
      setUpdateTags((prev) => [...prev, newTag])
      addTagMutation.mutate(
        { blog_id: blogId, tag: [newTag] },
        {
          onSettled: () => {
            return
          },
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs', 'detail', blogId] })
            queryClient.invalidateQueries({ queryKey: ['blogs', 'tags'] })
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
          }
        }
      )
    }
    setTypedTag('')
  }

  const handleMouseClick = () => {
    addTag(typedTag)
  }

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      addTag(typedTag)
    }
  }

  //! Handle delete tag
  const deleteTagMutation = useMutation({ mutationFn: blogApi.deleteTagOfBlog })
  const deleteTag = (deletedTag: string) => () => {
    setUpdateTags((prev) => prev.filter((tag) => tag != deletedTag))
    deleteTagMutation.mutate(
      { blog_id: blogId, tag: deletedTag },
      {
        onSettled: () => {
          return
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['blogs', 'detail', blogId] })
          queryClient.invalidateQueries({ queryKey: ['blogs', 'tags'] })
          queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
      }
    )
  }

  return (
    <div className='space-y-4 p-4'>
      <div className='space-y-2 rounded-md border border-white/60 p-2'>
        <p className='text-center text-lg font-semibold uppercase text-primaryBlue'>Danh mục có sẵn</p>
        {!blogTagsData && (
          <div className='flex w-full items-center justify-center'>
            <LoadingRing />
          </div>
        )}
        {blogTagsData && (
          <div className='grid grid-cols-4 gap-2'>
            {blogTagsData.data.data.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={handleChooseTag(tag)}
                className='flex items-center justify-center rounded-md bg-darkColor700 py-1 hover:bg-darkColor500'
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className='flex items-center justify-center space-x-2'>
        <input
          type='text'
          value={typedTag}
          onChange={handleTypedTag}
          className={classNames(
            'lg:text-lg rounded-lg bg-white px-2 py-1 text-base text-darkText outline outline-1 outline-primaryBlue/80 focus:outline-primaryBlue',
            { 'outline-alertRed': errorMessage }
          )}
          onKeyDown={handlePressEnter}
        />
        <button
          type='button'
          onClick={handleMouseClick}
          className='rounded-md border border-black/20 bg-primaryBlue/80 px-3 py-1 hover:bg-primaryBlue'
        >
          Thêm danh mục
        </button>
      </div>

      <div className='mt-2 grid h-20 grid-cols-1 gap-2 overflow-auto p-1 text-sm tablet:grid-cols-2 tabletLarge:grid-cols-3 desktop:grid-cols-4 desktopLarge:grid-cols-5'>
        {updateTags.map((tag, index) => (
          <div key={index} className='col-span-1 '>
            <div className='relative line-clamp-2 flex h-10 items-center justify-center rounded-md bg-primaryBlue/60 px-0.5'>
              {tag}
              <button type='button' className='absolute right-2 text-xl hover:text-red-600' onClick={deleteTag(tag)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
