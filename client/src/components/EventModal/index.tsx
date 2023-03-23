import { CloseIcon, DragHandleIcon } from '@chakra-ui/icons'
import { Formik } from 'formik'
import React from 'react'
import CalendarForm from './Forms/CalendarForm'
import DevelopmentForm from './Forms/DevelopmentForm'
import OwnerForm from './Forms/OwnerForm'
import PropertyForm from './Forms/PropertyForm'
import { PropertyOwnerForm } from './Forms/PropertyOwnerForm'
import { Subjects } from './subjects'

interface EventModalProps {
  className?: string
  formType: Subjects
  closeEvent: () => void
  onSubmit: (values: any, { setErrors }: any) => Promise<void>
  modalTitle: string
  initialValues: Object
  errors: any
}

export const EventModal: React.FC<EventModalProps> = ({
  className,
  formType,
  modalTitle,
  closeEvent,
  onSubmit,
  errors,
  initialValues,
}) => {
  function formDispatcher() {
    switch (formType) {
      case Subjects.Calendar:
        return <CalendarForm />
      case Subjects.AddOwner:
        return <OwnerForm />
      case Subjects.AddDevelopment:
        return <DevelopmentForm />
      case Subjects.AddProperty:
        return <PropertyForm />
      case Subjects.AddPropertyOwner:
        return <PropertyOwnerForm />
      default:
        return <></>
    }
  }

  return (
    <div className={`${className}`}>
      <div className="absolute left-0 top-1/4 w-full rounded-lg bg-white shadow-2xl md:left-24 md:top-1/4 md:w-3/4 lg:top-1/4 lg:left-1/4 lg:h-max lg:w-2/4">
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
              onSubmit(values, { setErrors })
            }
          >
            {formDispatcher}
          </Formik>
          {errors && (
            <div className="mt-4 text-center italic text-red-600">{errors}</div>
          )}
        </div>
        <footer className="mt-5 flex justify-end border-t p-3"></footer>
      </div>
    </div>
  )
}

export default EventModal
