import { useEffect, useState } from 'react'

export default function useTimer() {
  //Counter
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000)
  }, [counter])
  return { counter, setCounter }
}
