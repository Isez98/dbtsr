import React, { useContext } from 'react'
import Link from 'next/link'
import GlobalContext from '../../context/GlobalContext'

interface SideMenuProps {
  items: string[]
  className?: string
}

export const SideMenu: React.FC<SideMenuProps> = ({ items, className }) => {
  const { size, setSize } = useContext(GlobalContext)

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
            <Link href={`/${item !== 'home' ? item : ''}`}>{item}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default SideMenu
