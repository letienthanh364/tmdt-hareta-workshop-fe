import { InputHTMLAttributes, useState } from 'react'
import { useController, UseControllerProps, FieldValues, FieldPath } from 'react-hook-form'

export interface InputV2Props extends InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string
  errorClassName?: string
}

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
    value = '',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      setLocalValue(valueFromInput)
      field.onChange(event)
      onChange && onChange(event)
    }
  }

  return (
    <div className={className}>
      <input className={inputClassName} {...rest} {...field} onChange={handleChange} value={value || localValue} />
      <div className={errorClassName}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
