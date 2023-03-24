import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { ArrowRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import GlobalContext from '../../context/GlobalContext'
import { useLogoutMutation } from '../../generated/graphql'
import styles from './styles.module.scss'
import { NavMenu } from '../NavMenu'
import { MenuButtonProps } from '@headlessui/react'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const { size, setSize } = useContext(GlobalContext)
  const router = useRouter()
  const [, logout] = useLogoutMutation()

  return (
    <div
      className={
        'ml-auto flex w-full justify-between p-2 text-white lg:p-4 ' +
        styles.navbar
      }
    >
      <div className="flex">
        {size === true ? (
          <button className="hidden lg:flex" onClick={() => setSize(!size)}>
            <ArrowRightIcon />
          </button>
        ) : null}
        <NavMenu pathList={['home', 'owners', 'developments', 'properties']} />
        <button
          className="absolute top-3 ml-8 lg:top-1 lg:ml-5"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon style={{ height: '38px', width: '38px' }} />
        </button>
      </div>
      {/* <NavMenu pathList={['']} className="" /> */}
      {/* 
      <span>
        <span className="mr-5">Profile</span>
        <button
          onClick={() => {
            logout()
          }}
        >
          Logout
        </button>
      </span> */}
    </div>
  )
}

export default NavBar
