import { Form } from 'formik'
import React from 'react'
import { useDevelopmentsQuery } from '../../../../generated/graphql'
import InputField from '../../../InputField'
import { SelectField } from '../../../SelectField'

interface PropertyOwnerFormProps {}

export const PropertyOwnerForm: React.FC<PropertyOwnerFormProps> = ({}) => {
  const [{ data: developments }] = useDevelopmentsQuery({
    variables: { limit: 20 },
  })
  return (
    <Form>
      <div className="mb-4">
        <InputField
          name="ownerId"
          label="Owner"
          placeholder="Full Name"
          required
          readOnly
          disabled
        />
      </div>
      <div className="mb-6">
        <SelectField
          name="developmentId"
          label="Development"
          placeholder="Princesa de Peñasco"
          value={developments?.developments[0].id}
          options={developments?.developments}
          required
        />
      </div>
      <div className="mb-6">
        <InputField
          name="designation"
          label="Designation"
          placeholder="A-101"
          type={'text'}
          required
        />
      </div>
      <div className="mt-5 flex items-center justify-center">
        <button
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          Submit
        </button>
      </div>
    </Form>
  )
}
