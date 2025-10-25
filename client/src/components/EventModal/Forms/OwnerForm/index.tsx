import React from 'react'
import { Form } from 'formik'
import InputField from '../../../InputField'

interface OwnerFormProps {}

const OwnerForm: React.FC<OwnerFormProps> = () => {
  return (
    <Form>
      <div className="mb-4">
        <InputField name="name" label="Name" placeholder="Full Name" required />
      </div>
      <div className="mb-6">
        <InputField
          name="email"
          label="Email"
          placeholder="username@gmail.com"
          type={'email'}
          required
        />
      </div>
      <div>
        <InputField
          name="phone"
          label="Phone"
          placeholder="(000)-000-000"
          type={'tel'}
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

export default OwnerForm
