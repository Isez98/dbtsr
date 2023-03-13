import Link from 'next/link'
import React, { useContext } from 'react'
import { ArrowRightIcon } from '@chakra-ui/icons'
import GlobalContext from '../../context/GlobalContext'
import { useLogoutMutation } from '../../generated/graphql'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const { size, setSize } = useContext(GlobalContext)
  const [, logout] = useLogoutMutation()

  return (
    <div className="ml-auto flex w-full justify-between bg-red-700 p-4 text-white">
      {size === true ? (
        <button onClick={() => setSize(!size)}>
          <ArrowRightIcon />
        </button>
      ) : null}

      <div className="flex"></div>
      <span>
        <span className="mr-5">Profile</span>
        <button
          onClick={() => {
            logout()
          }}
        >
          Logout
        </button>
      </span>
    </div>
  )
}

export default NavBar
