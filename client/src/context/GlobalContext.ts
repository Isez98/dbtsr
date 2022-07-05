import React from 'react'
import dayjs from 'dayjs'

const GlobalContext = React.createContext({
  monthIndex: dayjs().month(),
  setMonthIndex: (index: number) => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (index: number) => {},
  daySelected: '' as any,
  setDaySelected: (text: dayjs.Dayjs) => {},
})

export default GlobalContext
