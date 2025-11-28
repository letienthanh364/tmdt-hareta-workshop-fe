import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { eventPath } from 'src/constants/path'
import { generateNameId } from 'src/utils/utils'
import { EventType } from 'src/types/event.type'

interface Props {
  event: EventType
}

export default function HomeEventSlide({ event }: Props) {
  //! Handle click event
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const handleClickItem = () => {
    navigate({ pathname: `${eventPath.events}/${generateNameId({ name: event.overall_content, id: event.id })}` })
    queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  }

  //! Logic to disable click on dragging
  const [isDragging, setIsDragging] = useState(false)
  const [mouseDown, setMouseDown] = useState(false)

  const handleMouseDown = () => {
    setMouseDown(true)
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) {
      event.preventDefault()
    }
    setMouseDown(false)
  }

  const handleMouseMove = () => {
    if (mouseDown) {
      setIsDragging(true)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) {
      e.preventDefault()
      setIsDragging(false)
    } else {
      handleClickItem()
    }
  }

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className='relative flex h-full w-full cursor-grab items-center justify-center bg-white'
    >
      <img
        src={event.avatar}
        alt={event.overall_content}
        className='absolute left-0 top-0 h-full w-full object-cover'
        draggable={false}
      />
      <p className='absolute bottom-4 left-1/2 line-clamp-2 w-11/12 -translate-x-1/2 overflow-hidden text-pretty rounded-full bg-black/90 px-8 py-1 text-left text-lg font-semibold tracking-wide text-lightText tablet:text-xl desktop:bottom-8 desktop:w-1/2 desktop:text-2xl'>
        {event.overall_content}
      </p>
    </button>
  )
}
