import { Formik, Form } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import InputField from '../../components/InputField'
import Wrapper from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { toErrorMap } from '../../utils/toErrorMap'
import NextLink from 'next/link'

export const ChangePassword: NextPage = () => {
  const router = useRouter()
  const [, changePassword] = useChangePasswordMutation()
  const [tokenError, setTokenError] = useState('')
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === 'string' ? router.query.token : '',
          })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(toErrorMap(response.data.changePassword.errors))
          } else if (response.data?.changePassword.user) {
            // works
            router.push('/')
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <div className="mb-1">
                <InputField
                  name="newPassword"
                  label="New Password"
                  placeholder="******"
                  type={'password'}
                />
              </div>
              {tokenError ? (
                <span>
                  <span className="text-s mr-2 italic text-red-500">
                    {tokenError}
                  </span>
                  <NextLink href={'/forgot-password'}>
                    <span className="cursor-pointer no-underline hover:underline">
                      Request a new link here
                    </span>
                  </NextLink>
                </span>
              ) : null}
              <div className="mt-3 flex items-center justify-center">
                <button
                  className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                  type="submit"
                  onClick={() => isSubmitting}
                >
                  Change Password
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

export default withUrqlClient(createUrqlClient)(ChangePassword)
