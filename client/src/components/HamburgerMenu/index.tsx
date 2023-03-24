import { HamburgerIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface HamburgerMenuProps {}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const genericHamburgerLine = `h-1 w-6 rounded-full bg-white transition ease transform duration-300`
  return (
    <React.Fragment>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className="group flex flex-col items-center justify-center lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div
              className={`${genericHamburgerLine} ${
                isOpen
                  ? 'translate-y-2 rotate-45 group-hover:opacity-100'
                  : 'm-0 p-0 group-hover:opacity-100'
              }`}
              style={{ marginBottom: '5px' }}
            />
            <div
              className={`${genericHamburgerLine} ${
                isOpen ? 'opacity-0' : 'm-0 p-0 group-hover:opacity-100'
              }`}
              style={{ marginBottom: '5px' }}
            />
            <div
              className={`${genericHamburgerLine} ${
                isOpen
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
          <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Account settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Support
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    License
                  </a>
                )}
              </Menu.Item>
              <form method="POST" action="#">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block w-full px-4 py-2 text-left text-sm'
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </form>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </React.Fragment>
  )
}
