import Link from 'next/link'
import React from 'react'
import { useLogoutMutation } from '../../generated/graphql'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [, logout] = useLogoutMutation()
  return (
    <div className="ml-auto flex w-full justify-between bg-red-700 p-4 text-white">
      <span>
        <span className="mr-5">
          <Link href={'/developments'}>Development</Link>
        </span>
        <span>
          <Link href={'/owners'}>Owners</Link>
        </span>
      </span>
      <span>
        <span className="mr-5">Hello there!</span>
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
