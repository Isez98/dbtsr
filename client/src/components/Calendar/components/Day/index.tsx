import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import GlobalContext from '../../../../context/GlobalContext'

interface IRents {
  __typename?: 'Rent' | undefined
  id: number
  checkIn: string
  checkOut: string
  propertyId: number
  rate: number
  people: number
  client: string
}
interface DayProps {
  day: dayjs.Dayjs
  rowIdx: number
  rents: IRents[] | undefined
  onDragStart: React.MouseEventHandler<HTMLElement>
  onDragEnd: React.MouseEventHandler<HTMLElement>
}

export const Day: React.FC<DayProps> = ({
  day,
  rowIdx,
  rents,
  onDragStart,
  onDragEnd,
}) => {
  const { setDaySelected, setShowEventModal } = useContext(GlobalContext)
  const [getReserves, setGetReserves] = useState<IRents[] | undefined>(
    undefined
  )

  const getCurrentDayClass = () => {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-blue-600 text-white rounded-full w-7'
      : ''
  }

  useEffect(() => {
    console.log(rents)
    if (rents) {
      const rentsToday = rents
        .map((val) => {
          const fromDate = dayjs.unix(Number(val.checkIn) / 1000)
          const toDate = dayjs.unix(Number(val.checkOut) / 1000)
          if (day.endOf('day') >= fromDate && day <= toDate) {
            return val
          }
        })
        .filter((item) => item !== undefined) as IRents[]

      setGetReserves(rentsToday)
    }
  }, [rents])

  return (
    <div
      className="flex flex-col border border-gray-200 text-sm"
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
    >
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
        onClick={(e) => {
          setDaySelected(day)
          setShowEventModal(true)
          e.stopPropagation()
        }}
      >
        {''}
        {getReserves &&
          getReserves.map((rent) => {
            const fromDate = dayjs.unix(Number(rent.checkIn) / 1000)
            const toDate = dayjs.unix(Number(rent.checkOut) / 1000)
            if (fromDate.get('date') === day.get('date')) {
              return (
                <div
                  className="w-100 mb-1 h-5 rounded-l-lg bg-blue-400"
                  onClick={(e) => {
                    alert(rent.client)
                    e.stopPropagation()
                  }}
                  onMouseDown={() => {}}
                >
                  <p className="pl-2">{`${rent.client} — ${rent.propertyId}`}</p>
                </div>
              )
            }
            if (toDate.get('date') === day.get('date')) {
              return (
                <div className="w-100 mb-1 h-5 rounded-r-lg bg-blue-400"></div>
              )
            }
            return <div className="w-100 mb-1 h-5 bg-blue-400"></div>
          })}
      </div>
    </div>
  )
}

export default Day
