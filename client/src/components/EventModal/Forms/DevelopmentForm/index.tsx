import { Form } from 'formik'
import React from 'react'
import InputField from '../../../InputField'

export const DevelopmentForm: React.FC = ({}) => {
  return (
    <Form>
      <div className="mb-4">
        <InputField name="name" label="Name" placeholder="Full Name" required />
      </div>
      <div className="">
        <InputField
          name="location"
          label="Location"
          placeholder="1234 W. Oak Boulevard"
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

export default DevelopmentForm
