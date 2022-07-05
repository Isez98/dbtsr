import React from 'react'
import dayjs from 'dayjs'
import Day from '../Day'

interface MonthProps {
  month: dayjs.Dayjs[][]
}

export const Month: React.FC<MonthProps> = ({ month }) => {
  return (
    <div className="grid flex-1 grid-cols-7 grid-rows-5">
      {month.map((row, index) => (
        <React.Fragment key={index}>
          {row.map((day, idx) => (
            <Day day={day} key={idx} rowIdx={index} />
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Month
