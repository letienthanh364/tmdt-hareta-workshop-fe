import React, { useRef } from 'react'
import JoditEditor from 'jodit-react'

interface Props {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export default function NoToolbarJoditEditor({ content, setContent }: Props) {
  const editor = useRef(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = {
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    buttons: '',
    placeholder: ''
  }

  return (
    <JoditEditor
      ref={editor}
      value={content}
      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      // onChange={(newContent) => setContent(newContent)}
      config={config}
    />
  )
}
