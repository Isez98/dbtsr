import React from 'react'
import dayjs from 'dayjs'

const GlobalContext = React.createContext({
  size: false, // set a default value
  setSize: (size: boolean) => {},
  monthIndex: dayjs().month(),
  setMonthIndex: (index: number) => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (index: number) => {},
  daySelected: dayjs(),
  setDaySelected: (text: dayjs.Dayjs) => {},
  showEventModal: false,
  setShowEventModal: (show: boolean) => {},
})

export default GlobalContext
