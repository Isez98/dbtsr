import React, { useState, useContext, useEffect } from 'react'
import GlobalContext from '../../context/GlobalContext'
import EventModal from '../EventModal'
import CalendarHeader from './components/CalendarHeader'
import Month from './components/Month'
import Sidebar from './components/Sidebar'
import { getMonth } from './utils'

interface CalendarProps {}

export const Calendar: React.FC<CalendarProps> = ({}) => {
  const [currentMonth, setCurrentMonth] = useState(getMonth())
  const { monthIndex, showEventModal } = useContext(GlobalContext)

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex))
  }, [monthIndex])

  return (
    <React.Fragment>
      {showEventModal && <EventModal formType="Calendar" />}
      <div className="flex h-3/4 w-4/5 flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={currentMonth} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Calendar
