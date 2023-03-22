import { useField } from 'formik'
import React, { SelectHTMLAttributes, useState } from 'react'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  name: string
  options: any[] | undefined
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  size: _,
  options = [],
  value,
  ...props
}) => {
  const [field, { error }] = useField(props)
  const [selectedValue, setSelectedValue] = useState(value)
  return (
    <div>
      <label
        className="mb-2 block text-sm font-bold text-gray-700"
        htmlFor={field.name}
      >
        {label}
      </label>
      <select
        {...field}
        {...props}
        className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 py-2 px-3 leading-tight text-gray-700 shadow
        ${error ? 'border-red-500' : ''}`}
        id={field.name}
        value={selectedValue}
      >
        {options &&
          options.map((option, idx) => {
            return (
              <option
                key={idx}
                value={option.id}
                onClick={() => setSelectedValue(option.id)}
              >
                {option.name}
              </option>
            )
          })}
      </select>
      {error ? <p className="text-xs italic text-red-500">{error}</p> : null}
    </div>
  )
}
