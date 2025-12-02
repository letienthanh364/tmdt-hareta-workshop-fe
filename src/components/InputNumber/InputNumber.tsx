import { InputHTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react'

const INTEGER_REGEX = /^\d*$/
const DECIMAL_REGEX = /^\d*(\.\d*)?$/

const toInputString = (value: InputNumberProps['value']) => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'number') {
    return Number.isNaN(value) ? '' : value.toString()
  }
  if (Array.isArray(value)) {
    return value.join('')
  }
  return value.toString()
}

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  inputClassName?: string
  errorClassName?: string
  integerOnly?: boolean
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    inputClassName = 'w-full rounded-sm border border-gray-300 p-3 outline-none outline focus:border-gray-500 focus:shadow-sm',
    errorClassName = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    onChange,
    value: valueProp,
    integerOnly = false,
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(() => toInputString(valueProp))
  const skipSyncRef = useRef(false)

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }
    setLocalValue(toInputString(valueProp))
  }, [valueProp])
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const regex = integerOnly ? INTEGER_REGEX : DECIMAL_REGEX
    if (regex.test(value) || value === '') {
      setLocalValue(value)
      skipSyncRef.current = true
      onChange && onChange(event)
    }
  }

  return (
    <div className={className}>
      <input className={inputClassName} onChange={handleChange} value={localValue} {...rest} ref={ref} />
      <div className={errorClassName}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
