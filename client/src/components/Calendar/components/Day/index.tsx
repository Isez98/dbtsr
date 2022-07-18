import React, { useContext } from 'react'
import dayjs from 'dayjs'
import GlobalContext from '../../../../context/GlobalContext'

interface DayProps {
  day: dayjs.Dayjs
  rowIdx: number
}

export const Day: React.FC<DayProps> = ({ day, rowIdx }) => {
  const { setDaySelected, setShowEventModal } = useContext(GlobalContext)

  const getCurrentDayClass = () => {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-blue-600 text-white rounded-full w-7'
      : ''
  }

  return (
    <div className="flex flex-col border border-gray-200 text-sm">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="mt-1 text-sm">{day.format('ddd').toUpperCase()}</p>
        )}
        <p className={`my-1 p-1 text-center text-sm ${getCurrentDayClass()}`}>
          {day.format('DD')}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day)
          setShowEventModal(true)
        }}
      >
        {''}
      </div>
    </div>
  )
}

export default Day
