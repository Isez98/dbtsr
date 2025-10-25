import React, { useState, useContext, useEffect } from 'react'
import GlobalContext from '../../context/GlobalContext'
import EventModal from '../EventModal'
import { Subjects } from '../EventModal/subjects'
import CalendarHeader from './components/CalendarHeader'
import Month from './components/Month'
import Sidebar from './components/Sidebar'
import { getMonth } from './utils'

interface CalendarProps {}

export const Calendar: React.FC<CalendarProps> = ({}) => {
  const [currentMonth, setCurrentMonth] = useState(getMonth())
  const { monthIndex, showEventModal, setShowEventModal } =
    useContext(GlobalContext)

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex))
  }, [monthIndex])

  return (
    <React.Fragment>
      <div className="w-5/6- flex h-2/3 flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={currentMonth} />
        </div>
      </div>
      {showEventModal && (
        <EventModal
          formType={Subjects.Calendar}
          modalTitle="Add Rent"
          closeEvent={() => setShowEventModal(false)}
          onSubmit={async (values: any, { setErrors }: any) => {
            setShowEventModal(false)
          }}
          initialValues={{}}
          errors={undefined}
        />
      )}
    </React.Fragment>
  )
}

export default Calendar
