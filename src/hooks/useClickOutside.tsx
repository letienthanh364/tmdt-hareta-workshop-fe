import { useEffect, useRef, useState } from 'react'

export default function useClickOutside(initialValue: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState<boolean>(initialValue)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) setVisible(false)
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setVisible(false)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    document.addEventListener('keydown', handleKeyPress, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
      document.removeEventListener('keydown', handleKeyPress, true)
    }
  }, [ref])
  return { visible, setVisible, ref }
}
