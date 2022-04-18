import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { SizeContext } from '../../utils/sizeContext'

interface SideMenuProps {
  items: string[]
  className?: string
}

export const SideMenu: React.FC<SideMenuProps> = ({ items, className }) => {
  const { size, setSize } = useContext(SizeContext)

  return (
    <div
      className={`Navbar__Container flex h-full flex-col capitalize ${
        size ? 'bar__close' : 'bar__open'
      }`}
    >
      <button onClick={() => setSize(!size)}>{'Close'}</button>
      {items.map((item, key) => {
        return (
          <div key={`sideItem-${key}`}>
            <Link href={`/${item}`}>{item}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default SideMenu
