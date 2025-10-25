import React, { useEffect } from 'react'
import dayjs from 'dayjs'
import Day from '../Day'
import { useRentsQuery } from '../../../../generated/graphql'
interface MonthProps {
  month: dayjs.Dayjs[][]
}

export const Month: React.FC<MonthProps> = ({ month }) => {
  const [{ data }] = useRentsQuery({
    variables: { limit: 10 },
  })

  return (
    <div className="grid flex-1 grid-cols-7 grid-rows-5">
      {month.map((row, index) => (
        <React.Fragment key={index}>
          {row.map((day, idx) => (
            <Day
              day={day}
              key={idx}
              rowIdx={index}
              rents={data?.rents}
              onDragStart={(event) => console.log(event.target)}
              onDragEnd={(event) => console.log(event.target)}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Month
