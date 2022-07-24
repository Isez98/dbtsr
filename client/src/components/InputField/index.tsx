import { useField } from 'formik'
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props)
  return (
    <div>
      <label
        className="mb-2 block text-sm font-bold text-gray-700"
        htmlFor={field.name}
      >
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={`focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none 
        ${error ? 'border-red-500' : ''}`}
        id={field.name}
      />
      {error ? <p className="text-xs italic text-red-500">{error}</p> : null}
    </div>
  )
}

export default InputField
