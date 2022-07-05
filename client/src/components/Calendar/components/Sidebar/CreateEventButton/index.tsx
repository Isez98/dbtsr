import React from 'react'
import { PlusSquareIcon } from '@chakra-ui/icons'

interface CreateEventButtonProps {}

export const CreateEventButton: React.FC<CreateEventButtonProps> = ({}) => {
  return (
    <button className="flex items-center rounded-full border p-2 shadow-lg hover:shadow">
      <PlusSquareIcon />
      <span className="pl-3 pr-7">Create</span>
    </button>
  )
}

export default CreateEventButton
