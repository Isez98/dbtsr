import { CloseIcon, DragHandleIcon } from '@chakra-ui/icons'
import { Formik } from 'formik'
import React from 'react'
import CalendarForm from './Forms/CalendarForm'
import DevelopmentForm from './Forms/DevelopmentForm'
import OwnerForm from './Forms/OwnerForm'
import PropertyForm from './Forms/PropertyForm'

interface EventModalProps {
  className?: string
  formType: 'Calendar' | 'Owner' | 'Development' | 'Property'
  closeEvent: () => void
  onSubmit: (values: any, { setErrors }: any) => Promise<void>
  modalTitle: string
  initialValues: Object
}

export const EventModal: React.FC<EventModalProps> = ({
  className,
  formType,
  modalTitle,
  closeEvent,
  onSubmit,
  initialValues,
}) => {
  function formDispatcher() {
    switch (formType) {
      case 'Calendar':
        return <CalendarForm />
      case 'Owner':
        return <OwnerForm />
      case 'Development':
        return <DevelopmentForm />
      case 'Property':
        return <PropertyForm />
      default:
        return <></>
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 flex h-screen w-full items-center justify-center ${className}`}
    >
      <div className="w-1/4 rounded-lg bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-gray-100 px-4 py-2">
          <span className="text-gray-400">
            <DragHandleIcon />
          </span>
          <h3>{modalTitle}</h3>
          <button onClick={() => closeEvent()}>
            <span className="text-gray-400">
              <CloseIcon />
            </span>
          </button>
        </header>
        <div className="p-3">
          <Formik
            initialValues={initialValues}
            onSubmit={async (values, { setErrors }) =>
              onSubmit(values, setErrors)
            }
          >
            {formDispatcher}
          </Formik>
        </div>
        <footer className="mt-5 flex justify-end border-t p-3"></footer>
      </div>
    </div>
  )
}

export default EventModal
