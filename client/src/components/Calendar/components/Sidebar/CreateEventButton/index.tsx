import React, { useContext } from 'react'
import { PlusSquareIcon } from '@chakra-ui/icons'
import GlobalContext from '../../../../../context/GlobalContext'

interface CreateEventButtonProps {}

export const CreateEventButton: React.FC<CreateEventButtonProps> = ({}) => {
  const { setShowEventModal } = useContext(GlobalContext)

  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="flex items-center rounded-full border p-2 shadow-lg hover:shadow"
    >
      <PlusSquareIcon />
      <span className="pl-3 pr-7">Create</span>
    </button>
  )
}

export default CreateEventButton
