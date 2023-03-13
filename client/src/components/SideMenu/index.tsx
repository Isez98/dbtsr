import React, { ReactElement, useContext } from 'react'
import Link from 'next/link'
import GlobalContext from '../../context/GlobalContext'
import { CloseIcon, IconProps } from '@chakra-ui/icons'
import styles from './styles.module.scss'
import { ComponentWithAs } from '@chakra-ui/system'

interface SideMenuProps {
  items: { page: string; icon: ReactElement }[]
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
      <div className={styles.sideMenu}>
        <div className="mt-3 flex items-center justify-center">
          <button onClick={() => setSize(!size)}>
            <CloseIcon className="mx-3" />
          </button>
        </div>
        <ul className="mt-5">
          {items.map((item, key) => {
            return (
              <li key={`sideItem-${key}`} className="mb-6 hover:cursor-pointer">
                <Link href={`/${item.page !== 'home' ? item.page : ''}`}>
                  <div className="w-100">
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.page}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SideMenu
