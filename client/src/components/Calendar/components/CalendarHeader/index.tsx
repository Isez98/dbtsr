import React, { useContext } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import GlobalContext from '../../../../context/GlobalContext'
import dayjs from 'dayjs'

interface CalendarHeaderProps {}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({}) => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext)
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1)
  }
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1)
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    )
  }

  return (
    <header className="flex items-center px-4 py-2">
      <h1 className="mr-10 text-xl font-bold text-gray-500">Calendar</h1>
      <button
        onClick={handleReset}
        className="border-rounded mr-5 border py-2 px-4"
      >
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="mx-2 cursor-pointer text-4xl text-gray-600">
          <ChevronLeftIcon />
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="mx-2 cursor-pointer text-4xl text-gray-600">
          <ChevronRightIcon />
        </span>
      </button>
      <h2 className="ml-4 text-xl font-bold text-gray-500">
        {dayjs(new Date(dayjs().year(), monthIndex)).format('MMMM YYYY')}
      </h2>
    </header>
  )
}

export default CalendarHeader
