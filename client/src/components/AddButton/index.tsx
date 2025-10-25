import React from 'react'
import { AddIcon } from '@chakra-ui/icons'

interface AddButtonProps {
  onClick: () => void
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <div
      style={{ position: 'fixed', bottom: '15px', right: '15px' }}
      className="z-10"
    >
      <button
        className="flex items-center rounded-full border bg-blue-300 p-4 shadow-lg hover:shadow"
        onClick={() => onClick()}
      >
        <AddIcon />
      </button>
    </div>
  )
}

export default AddButton
