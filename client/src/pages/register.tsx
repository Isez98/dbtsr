import React from 'react'
import { Form, Formik } from 'formik'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { useRegisterMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [, register] = useRegisterMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values)
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user) {
            // works
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <div className="mb-4">
                <InputField name="email" label="Email" placeholder="Email" />
              </div>
              <div className="mb-6">
                <InputField
                  name="password"
                  label="Password"
                  placeholder="*********"
                  type="password"
                />
              </div>
              <div className="flex w-full content-center justify-center ">
                <button
                  className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                  type="submit"
                  onClick={() => isSubmitting}
                >
                  Register
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
      <p className="mt-3 text-center text-xs text-gray-500">
        &copy;2020 Desert By The Sea Rentals. All rights reserved.
      </p>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register)
