import React from 'react'
import CalendarForm from './Forms/CalendarForm'
import DevelopmentForm from './Forms/DevelopmentForm'
import OwnerForm from './Forms/OwnerForm'

interface EventModalProps {
  className?: string
  formType: 'Calendar' | 'Owner' | 'Development'
}

export const EventModal: React.FC<EventModalProps> = ({
  className,
  formType,
}) => {
  function formDispatcher() {
    switch (formType) {
      case 'Calendar':
        return <CalendarForm />
      case 'Owner':
        return <OwnerForm />
      case 'Development':
        return <DevelopmentForm />
      default:
        return <></>
    }
  }

  return (
    <div
      className={`fixed left-0 top-0 flex h-screen w-full items-center justify-center ${className}`}
    >
      {formDispatcher()}
    </div>
  )
}

export default EventModal
