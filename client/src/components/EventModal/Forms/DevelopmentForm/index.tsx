import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'
import { Formik, Form } from 'formik'
import React, { useContext } from 'react'
import GlobalContext from '../../../../context/GlobalContext'
import { useCreateDevelopmentMutation } from '../../../../generated/graphql'
import InputField from '../../../InputField'
import { toErrorMap } from '../../../../utils/toErrorMap'

export const DevelopmentForm: React.FC = ({}) => {
  const { setShowEventModal } = useContext(GlobalContext)
  const [, createDevelopment] = useCreateDevelopmentMutation()

  return (
    <>
      <div className="w-1/4 rounded-lg bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-gray-100 px-4 py-2">
          <span className="text-gray-400">
            <DragHandleIcon />
          </span>
          <button onClick={() => setShowEventModal(false)}>
            <span className="text-gray-400">
              <CloseIcon />
            </span>
          </button>
        </header>
        <div className="p-3">
          <Formik
            initialValues={{ name: '', location: '', logo: '' }}
            onSubmit={async (values, { setErrors }) => {
              const response = await createDevelopment(values)
              if (response.data?.createDevelopment.errors) {
                setErrors(toErrorMap(response.data.createDevelopment.errors))
              } else if (response.data?.createDevelopment.development) {
                //   // works
                setShowEventModal(false)
              }
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <div className="mb-4">
                    <InputField
                      name="name"
                      label="Name"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="mb-6">
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
                      className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
                      type="submit"
                      onClick={() => isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>

        <footer className="mt-5 flex justify-end border-t p-3"></footer>
      </div>
    </>
  )
}

export default DevelopmentForm
