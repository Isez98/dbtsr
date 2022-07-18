import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import GlobalContext from './GlobalContext'

interface IContextWrapperProps {}

export const ContextWrapper: React.FC<IContextWrapperProps> = (props) => {
  const [monthIndex, setMonthIndex] = useState(dayjs().month())
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(-1)
  const [daySelected, setDaySelected] = useState<dayjs.Dayjs>(dayjs())
  const [showEventModal, setShowEventModal] = useState(false)
  const [size, setSize] = useState<boolean>(false)

  useEffect(() => {
    if (smallCalendarMonth >= 0) {
      setMonthIndex(smallCalendarMonth)
    }
  }, [smallCalendarMonth])

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        size,
        setSize,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  )
}

export default ContextWrapper
