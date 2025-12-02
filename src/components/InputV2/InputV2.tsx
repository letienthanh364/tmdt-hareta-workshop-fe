import { InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { useController, UseControllerProps, FieldValues, FieldPath } from 'react-hook-form'

export interface InputV2Props extends InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string
  errorClassName?: string
  integerOnly?: boolean
}

const toInputString = (value: unknown) => {
  if (value === undefined || value === null) return ''
  if (typeof value === 'number') {
    return Number.isNaN(value) ? '' : value.toString()
  }
  if (Array.isArray(value)) {
    return value.join('')
  }
  return String(value)
}

const INTEGER_REGEX = /^\d*$/
const DECIMAL_REGEX = /^\d*(\.\d*)?$/

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputV2Props) {
  const {
    type,
    onChange,
    className,
    inputClassName = 'w-full rounded-sm border border-gray-300 p-3 outline-none outline focus:border-gray-500 focus:shadow-sm',
    errorClassName = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    value: valueProp,
    integerOnly = false,
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const { ref: fieldRef, value: fieldValue, onChange: fieldOnChange, ...fieldRest } = field
  const controlledValue = valueProp ?? fieldValue
  const [localValue, setLocalValue] = useState<string>(() => toInputString(controlledValue))
  const skipSyncRef = useRef(false)

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false
      return
    }
    setLocalValue(toInputString(controlledValue))
  }, [controlledValue])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value
    const regex = integerOnly ? INTEGER_REGEX : DECIMAL_REGEX
    const numberCondition = type === 'number' && (regex.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      setLocalValue(valueFromInput)
      skipSyncRef.current = true
      fieldOnChange(event)
      onChange && onChange(event)
    }
  }

  return (
    <div className={className}>
      <input
        type={type}
        className={inputClassName}
        {...rest}
        {...fieldRest}
        ref={fieldRef}
        onChange={handleChange}
        value={localValue}
      />
      <div className={errorClassName}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
