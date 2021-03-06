import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import dayjs from 'dayjs'
import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../../../../../context/GlobalContext'
import { getMonth } from '../../../utils'

interface SmallCalendarProps {}

export const SmallCalendar: React.FC<SmallCalendarProps> = ({}) => {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month())
  const [currentMonth, setCurrentMonth] = useState(getMonth())
  const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected } =
    useContext(GlobalContext)

  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx))
  }, [currentMonthIdx])

  useEffect(() => {
    setCurrentMonthIdx(monthIndex)
  }, [monthIndex])

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1)
  }

  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1)
  }

  function getDayClass(day: any) {
    const format = 'DD-MM-YY'
    const nowDay = dayjs().format(format)
    const currDay = day.format(format)
    const slcDay = daySelected && daySelected.format(format)

    if (nowDay === currDay) {
      return 'bg-blue-500 rounded-full text-white'
    } else if (currDay === slcDay) {
      return 'bg-blue-100 rounded-full text-blue-600 font-bold'
    } else {
      return ''
    }
  }

  return (
    <div className="mt-9">
      <header className="flex justify-between">
        <p className="font-bold text-gray-500">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format('MMMM YYYY')}
        </p>
        <div>
          <button onClick={handlePrevMonth}>
            <span className="mx-2 cursor-pointer text-xl text-gray-600">
              <ChevronLeftIcon />
            </span>
          </button>
          <button onClick={handleNextMonth}>
            <span className="mx-2 cursor-pointer text-xl text-gray-600">
              <ChevronRightIcon />
            </span>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day, index) => {
          return (
            <span
              key={`smallCalendar-${index}`}
              className="py-1 text-center text-sm"
            >
              {day.format('dd').charAt(0)}
            </span>
          )
        })}
        {currentMonth.map((row, index) => {
          return (
            <React.Fragment key={`smallCalendar-row-${index}`}>
              {row.map((day, idx) => {
                return (
                  <button
                    key={`smallCalendar-button-${idx}`}
                    onClick={() => {
                      setSmallCalendarMonth(currentMonthIdx)
                      setDaySelected(day)
                    }}
                    className={`w-full py-1 ${getDayClass(day)}`}
                  >
                    <span className="text-sm">{day.format('D')}</span>
                  </button>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default SmallCalendar
