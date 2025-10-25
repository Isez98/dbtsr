import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'
import NextLink from 'next/link'
import Head from 'next/head'

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter()
  const [, login] = useLoginMutation()
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Wrapper variant="regular">
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values)
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors))
            } else if (response.data?.login.user) {
              if (typeof router.query.next === 'string') {
                router.push(router.query.next)
              } else {
                // works
                router.push('/')
              }
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
                <div className="flex justify-between items-center">
                  <button
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded focus:shadow-outline hover:bg-blue-700 focus:outline-none"
                    type="submit"
                    onClick={() => isSubmitting}
                  >
                    Login
                  </button>
                  <NextLink href="/forgot-password">
                    <span className="inline-block text-sm font-bold text-blue-500 align-baseline cursor-pointer hover:text-blue-800">
                      Forgot Password?
                    </span>
                  </NextLink>
                </div>
              </Form>
            )
          }}
        </Formik>
        <p className="mt-3 text-xs text-center text-gray-500">
          &copy;2020 Desert By The Sea Rentals. All rights reserved.
        </p>
      </Wrapper>
    </>
  )
}

export default withUrqlClient(createUrqlClient)(Login)
