import Link from 'next/link'
import React from 'react'
import { useLogoutMutation } from '../../generated/graphql'

interface NavBarProps {
  routes: string[]
}

export const NavBar: React.FC<NavBarProps> = ({ routes }) => {
  const [, logout] = useLogoutMutation()

  return (
    <div className="ml-auto flex w-full justify-between bg-red-700 p-4 text-white">
      <div className="flex">
        {routes.map((item) => {
          return (
            <div className="mr-5 capitalize">
              <Link href={`/${item === 'home' ? '' : item}`}>{item}</Link>
            </div>
          )
        })}
      </div>
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
