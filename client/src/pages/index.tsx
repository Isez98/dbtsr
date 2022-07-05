import { withUrqlClient } from 'next-urql'
import Head from 'next/head'
import { useContext } from 'react'
import Calendar from '../components/Calendar'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideMenu'
import ContextWrapper from '../context/ContextWrapper'
import { createUrqlClient } from '../utils/createUrqlClient'
import { SizeContext } from '../utils/sizeContext'

const Home = () => {
  const { size } = useContext(SizeContext)
  return (
    <div className="min-h-4/5 flex flex-col">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-3/4">
        <SideMenu className=" px-3" items={['home', 'developments']} />
        <div
          className={`page-container bg-white ${
            size ? 'page__widen' : 'page__shrink'
          }`}
        >
          <NavBar routes={['owners', 'developments']} />
          <main className="flex h-screen w-full flex-1 flex-col items-center justify-center px-20 text-center">
            <ContextWrapper>
              <Calendar />
            </ContextWrapper>
          </main>
        </div>
      </div>
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(Home)
