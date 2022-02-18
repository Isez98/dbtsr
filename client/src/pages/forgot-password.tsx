import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import router from 'next/router'
import React, { useState } from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'
import NextLink from 'next/link'
import { useForgotPasswordMutation } from '../generated/graphql'

export const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword(values)
          setComplete(true)
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <>An email was sent to the provided email </>
          ) : (
            <Form>
              <div className="mb-6">
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                  type="submit"
                  onClick={() => isSubmitting}
                >
                  Send
                </button>
              </div>
            </Form>
          )
        }
      </Formik>
      <p className="mt-3 text-center text-xs text-gray-500">
        &copy;2020 Desert By The Sea Rentals. All rights reserved.
      </p>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
