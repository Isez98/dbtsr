import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values)
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
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
              <div className="flex items-center justify-between">
                <button
                  className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                  type="submit"
                  onClick={() => isSubmitting}
                >
                  Login
                </button>
                <a
                  className="inline-block align-baseline text-sm font-bold text-blue-500 hover:text-blue-800"
                  href="#"
                >
                  Forgot Password?
                </a>
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

export default withUrqlClient(createUrqlClient)(Login)
