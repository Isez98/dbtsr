import React, { useState } from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface NavMenuProps {
  iconElement?: () => JSX.Element
  pathList: String[]
  className?: string
}

export const NavMenu: React.FC<NavMenuProps> = ({
  iconElement = () => <div>Options</div>,
  pathList,
  className,
}) => {
  const genericHamburgerLine = `h-1 w-6 rounded-full bg-white transition ease transform duration-300`
  return (
    <span className={className}>
      <Menu
        as="div"
        className="relative inline-block cursor-pointer text-left capitalize"
      >
        {({ open, close }) => (
          <React.Fragment>
            {' '}
            <div>
              <Menu.Button className="group flex flex-col items-center justify-center lg:hidden">
                <div
                  className={`${genericHamburgerLine} ${
                    open
                      ? 'translate-y-2 rotate-45 group-hover:opacity-100'
                      : 'm-0 p-0 group-hover:opacity-100'
                  }`}
                  style={{ marginBottom: '5px' }}
                />
                <div
                  className={`${genericHamburgerLine} ${
                    open ? 'opacity-0' : 'm-0 p-0 group-hover:opacity-100'
                  }`}
                  style={{ marginBottom: '5px' }}
                />
                <div
                  className={`${genericHamburgerLine} ${
                    open
                      ? '-translate-y-2.5 -rotate-45  group-hover:opacity-100'
                      : 'm-0 p-0  group-hover:opacity-100'
                  }`}
                  style={{ marginBottom: '5px' }}
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1">
                  {pathList.map((item, idx) => {
                    return (
                      <Menu.Item key={idx}>
                        <Link href={`/${item !== 'home' ? item : ''}`}>
                          <div
                            className={classNames(
                              open
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => {
                              close()
                            }}
                          >
                            <span>{item}</span>
                          </div>
                        </Link>
                      </Menu.Item>
                    )
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </React.Fragment>
        )}
      </Menu>
    </span>
  )
}
