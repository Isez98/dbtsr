import React, { useContext } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import GlobalContext from '../../context/GlobalContext'

interface AddButtonProps {}

export const AddButton: React.FC<AddButtonProps> = ({}) => {
  const { setShowEventModal } = useContext(GlobalContext)

  return (
    <div
      style={{ position: 'fixed', bottom: '15px', right: '15px' }}
      className="z-10"
    >
      <button
        className="flex items-center rounded-full border bg-blue-300 p-4 shadow-lg hover:shadow"
        onClick={() => setShowEventModal(true)}
      >
        <AddIcon />
      </button>
    </div>
  )
}

export default AddButton
