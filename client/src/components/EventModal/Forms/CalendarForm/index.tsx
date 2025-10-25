import React, { useContext, useState } from 'react'
import GlobalContext from '../../../../context/GlobalContext'
import { TimeIcon, EditIcon, AttachmentIcon, CheckIcon } from '@chakra-ui/icons'

interface CalendarFormProps {}

export const CalendarForm: React.FC<CalendarFormProps> = ({}) => {
  const { daySelected } = useContext(GlobalContext)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [checkIn, setCheckIn] = useState(daySelected.format('YYYY-MM-DD'))
  const [checkOut, setCheckOut] = useState(daySelected.format('YYYY-MM-DD'))
  const labelsClasses = ['indigo', 'gray', 'green', 'blue', 'red', 'purple']
  const [selectedLabel, setSelectedLabel] = useState(labelsClasses[0])

  return (
    <>
      <div className="p-3">
        <div className="grid grid-cols-1/5 items-end gap-y-7">
          <div></div>
          <input
            type="text"
            name="title"
            placeholder="Add Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border-0 border-b-2 border-gray-200 pt-3 pb-2 text-xl font-semibold text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <span className="text-gray-400">
            <TimeIcon />
          </span>
          <div className="grid grid-cols-1/2 items-end gap-y-7">
            <div className="flex flex-col pr-8">
              <label htmlFor="check-in">Check-in</label>
              <input
                type="date"
                name="check-in"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col pr-8">
              <label htmlFor="check-out">Check-out</label>
              <input
                type="date"
                name="check-out"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>
          <span className="text-gray-400">
            <EditIcon className="mb-3" />
          </span>
          <input
            type="text"
            name="description"
            placeholder="Add a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border-0 border-b-2 border-gray-200 pt-3 pb-2 text-sm text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <span className="text-gray-400">
            <AttachmentIcon className="mb-3" />
          </span>
          <div className="flex gap-x-2">
            {labelsClasses.map((lblClass: string, index: number) => {
              return (
                <span
                  key={index}
                  onClick={() => setSelectedLabel(lblClass)}
                  className={`mb-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-${lblClass}-500`}
                >
                  {selectedLabel === lblClass && (
                    <span className="text-sm text-white">
                      <CheckIcon className="" />
                    </span>
                  )}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default CalendarForm
