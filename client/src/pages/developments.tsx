import Head from 'next/head'
import React, { useContext } from 'react'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideMenu'
import { SizeContext } from '../utils/sizeContext'

interface DevelopmentsProps {}

export const Developments: React.FC<DevelopmentsProps> = ({}) => {
  const { size } = useContext(SizeContext)
  return (
    <div className="h-full w-full">
      <Head>
        <title>Developments</title>
      </Head>
      <div className="flex w-full">
        <SideMenu className=" px-3" items={['home', 'owners']} />
        <div
          className={`page-container bg-white ${
            size ? 'page__widen' : 'page__shrink'
          }`}
        >
          <NavBar routes={['home', 'owners']} />
          <main className="h-auto">
            <h1>Development's page</h1>
          </main>
          <footer>Desert By The Sea Rentals</footer>
        </div>
      </div>
    </div>
  )
}

export default Developments
