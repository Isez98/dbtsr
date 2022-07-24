import React, { useContext, useState } from 'react'
import GlobalContext from '../../../../context/GlobalContext'
import {
  DragHandleIcon,
  CloseIcon,
  TimeIcon,
  EditIcon,
  AttachmentIcon,
  CheckIcon,
} from '@chakra-ui/icons'

interface CalendarFormProps {}

export const CalendarForm: React.FC<CalendarFormProps> = ({}) => {
  const { setShowEventModal, daySelected } = useContext(GlobalContext)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const labelsClasses = ['indigo', 'gray', 'green', 'blue', 'red', 'purple']
  const [selectedLabel, setSelectedLabel] = useState(labelsClasses[0])

  return (
    <>
      <form action="" className="w-1/4 rounded-lg bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-gray-100 px-4 py-2">
          <span className="text-gray-400">
            <DragHandleIcon />
          </span>
          <button onClick={() => setShowEventModal(false)}>
            <span className="text-gray-400">
              <CloseIcon />
            </span>
          </button>
        </header>
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
            <p className="text-left">{daySelected.format('dddd, MMMM DD')}</p>
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
                    className={`bg-${lblClass}-500 mb-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full`}
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
        <footer className="mt-5 flex justify-end border-t p-3">
          <button
            type="submit"
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </footer>
      </form>
    </>
  )
}

export default CalendarForm
