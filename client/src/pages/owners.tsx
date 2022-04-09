import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import Head from 'next/head'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import InputField from '../components/InputField'
import NavBar from '../components/NavBar'
import { useOwnersQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'
import login from './login'

interface OwnersProps {}

export const Owners: React.FC<OwnersProps> = ({}) => {
  const [{ data }] = useOwnersQuery()
  const [ownersData, setOwnersData] = useState({})

  useEffect(() => {
    setOwnersData(() => data)
  }, [])

  return (
    <div>
      <Head>
        <title>Owners</title>
      </Head>
      <NavBar routes={['home', 'developments']} />
      <main>
        <h1>Owner's page</h1>
        {/* <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await owners(values)
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
              </div>
            </Form>
          )
        }}
      </Formik> */}
      </main>
      <footer>Desert By The Sea Rentals</footer>
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(Owners)
