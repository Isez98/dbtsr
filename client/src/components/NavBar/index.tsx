import Link from 'next/link'
import React from 'react'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <div className="ml-auto flex w-full justify-between bg-red-700 p-4 text-white">
      <span>Hello world</span>
      <span>
        <span className="mr-5">
          <Link href={'/developments'}>Development</Link>
        </span>
        <span>
          <Link href={'/owners'}>Owners</Link>
        </span>
      </span>
    </div>
  )
}

export default NavBar
