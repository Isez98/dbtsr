import React from 'react'
import dayjs from 'dayjs'

interface DayProps {
  day: dayjs.Dayjs
  rowIdx: number
}

export const Day: React.FC<DayProps> = ({ day, rowIdx }) => {
  const getCurrentDayClass = () => {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-blue-600 text-white rounded-full w-7'
      : ''
  }
  return (
    <div className="mx-3 flex flex-col border border-gray-200 text-sm">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="mt-1 text-sm">{day.format('ddd').toUpperCase()}</p>
        )}
        <p className={`my-1 p-1 text-center text-sm ${getCurrentDayClass()}`}>
          {day.format('DD')}
        </p>
      </header>
    </div>
  )
}

export default Day
