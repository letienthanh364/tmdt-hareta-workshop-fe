import React, { TextareaHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  wrapperClassName?: string
  inputClassName?: string
  errorSection?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function AdminTextArea({
  name,
  register,
  className = 'bg-transparent',
  rules,
  children,
  errorSection,
  inputClassName = 'w-full rounded-sm border border-gray-300 p-3 outline-none outline',
  wrapperClassName = '',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={wrapperClassName}>
      <div className={className}>
        {children}
        <textarea rows={3} className={inputClassName} {...registerResult} {...rest} />
      </div>
      {errorSection}
    </div>
  )
}
