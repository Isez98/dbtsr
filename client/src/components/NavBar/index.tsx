import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { ArrowRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import GlobalContext from '../../context/GlobalContext'
import { useLogoutMutation } from '../../generated/graphql'
import styles from './styles.module.scss'
import { HamburgerMenu } from '../HamburgerMenu'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const { size, setSize } = useContext(GlobalContext)
  const router = useRouter()
  const [, logout] = useLogoutMutation()

  return (
    <div
      className={
        'ml-auto flex w-full justify-between p-3 text-white lg:p-4 ' +
        styles.navbar
      }
    >
      <div className="flex">
        {size === true ? (
          <button className="hidden lg:flex" onClick={() => setSize(!size)}>
            <ArrowRightIcon />
          </button>
        ) : null}
        <HamburgerMenu />
        <button
          className="absolute top-0.5 ml-8 lg:-top-3 lg:ml-5"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon style={{ height: '38px', width: '38px' }} />
        </button>
      </div>
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
