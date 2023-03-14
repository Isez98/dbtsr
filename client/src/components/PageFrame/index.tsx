import Head from 'next/head'
import React, { useContext } from 'react'
import GlobalContext from '../../context/GlobalContext'
import { useMeQuery } from '../../generated/graphql'
import { isServer } from '../../utils/isServer'
import { Icon } from '@chakra-ui/icons'
import { BsBuildings, BsHouses, BsPeople, BsCalendarWeek } from 'react-icons/bs'
import NavBar from '../NavBar'
import SideMenu from '../SideMenu'

interface PageFrameProps {
  title: string
}

export const PageFrame: React.FC<PageFrameProps> = ({ children, title }) => {
  const { size } = useContext(GlobalContext)
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })

  const pageTitle = () => {
    if (title === '/') {
      return 'Home'
    }
    let subPage = title.indexOf('/', 2)
    if (subPage !== -1) {
      return `${title.slice(1, 2).toUpperCase()}${title.slice(2, subPage)}`
    }
    return `${title.slice(1, 2).toUpperCase()}${title.slice(2)}`
  }

  if (data?.me === null) {
    return <>{children}</>
  }

  return (
    <>
      {!fetching && (
        <>
          <Head>
            <title>{pageTitle()}</title>
          </Head>
          <div className="h-full w-full">
            <div className="flex w-full">
              <SideMenu
                className="px-3"
                items={[
                  {
                    page: 'home',
                    icon: <Icon as={BsCalendarWeek} w={25} h={25} />,
                  },
                  {
                    page: 'owners',
                    icon: <Icon as={BsPeople} w={25} h={25} />,
                  },
                  {
                    page: 'developments',
                    icon: <Icon as={BsBuildings} w={25} h={25} />,
                  },
                  {
                    page: 'properties',
                    icon: <Icon as={BsHouses} w={25} h={25} />,
                  },
                ]}
              />
              <div
                className={`page-container bg-white ${
                  size ? 'page__widen' : 'page__shrink'
                }`}
              >
                <NavBar />
                <main className="justify-content-center h-95 container mb-5">
                  {children}
                </main>
                <footer className="w-100 flex justify-center">
                  <p className="mt-3 text-center text-xs text-gray-500">
                    &copy;2020 Desert By The Sea Rentals. All rights reserved.
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default PageFrame
