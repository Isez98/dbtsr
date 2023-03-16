import React from 'react'
import { Form } from 'formik'
import InputField from '../../../InputField'

interface PropertyFormProps {}

const PropertyForm: React.FC<PropertyFormProps> = ({}) => {
  return (
    <Form>
      <div className="mb-4">
        <InputField
          name="ownerId"
          label="Owner"
          placeholder="Full Name"
          required
        />
      </div>
      <div className="mb-6">
        <InputField
          name="developmentId"
          label="Development"
          placeholder="Princesa de Peñasco"
          type={'text'}
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

export default PropertyForm
