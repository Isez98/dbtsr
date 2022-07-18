import React, { useContext } from 'react'
import GlobalContext from '../../../../context/GlobalContext'
import { DragHandleIcon, CloseIcon } from '@chakra-ui/icons'
import { Form, Formik } from 'formik'
import InputField from '../../../InputField'
import { useCreateOwnerMutation } from '../../../../generated/graphql'
import { toErrorMap } from '../../../../utils/toErrorMap'

interface OwnerFormProps {}

export const OwnerForm: React.FC<OwnerFormProps> = ({}) => {
  const { setShowEventModal } = useContext(GlobalContext)
  const [, createOwner] = useCreateOwnerMutation()

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
            initialValues={{ name: '', email: '', phone: '' }}
            onSubmit={async (values, { setErrors }) => {
              const response = await createOwner(values)
              if (response.data?.createOwner.errors) {
                setErrors(toErrorMap(response.data.createOwner.errors))
              } else if (response.data?.createOwner.owner) {
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

export default OwnerForm
