import React, { useRef } from 'react'
import JoditEditor from 'jodit-react'

interface Props {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export default function CustomJoditEditor({ content, setContent }: Props) {
  const editor = useRef(null)

  return (
    <JoditEditor
      ref={editor}
      value={content}
      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      // onChange={(newContent) => setContent(newContent)}
    />
  )
}
