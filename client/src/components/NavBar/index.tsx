import Link from 'next/link'
import React, { useContext } from 'react'
import { useLogoutMutation } from '../../generated/graphql'
import { SizeContext } from '../../utils/sizeContext'

interface NavBarProps {
  routes: string[]
}

export const NavBar: React.FC<NavBarProps> = ({ routes }) => {
  const { size, setSize } = useContext(SizeContext)
  const [, logout] = useLogoutMutation()

  return (
    <div className="ml-auto flex w-full justify-between bg-red-700 p-4 text-white">
      {size === true ? (
        <button onClick={() => setSize(!size)}>Open</button>
      ) : null}

      <div className="flex">
        {routes.map((item, key) => {
          return (
            <div key={`Nav-item-${key}`} className="mr-5 capitalize">
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
