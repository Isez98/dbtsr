import Head from 'next/head'
import React, { useContext } from 'react'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideMenu'
import Table from '../components/Table'
import GlobalContext from '../context/GlobalContext'
import { useDevelopmentsQuery } from '../generated/graphql'

interface DevelopmentsProps {}

export const Developments: React.FC<DevelopmentsProps> = ({}) => {
  const { size } = useContext(GlobalContext)
  const [{ data }] = useDevelopmentsQuery()

  const columns = [
    { title: 'Name', key: 'name' },
    { title: 'Location', key: 'location' },
  ]

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
          <main className="justify-content-center container h-auto">
            {data ? (
              <>
                <Table
                  columns={columns}
                  data={data.developments}
                  className="p-6"
                />
              </>
            ) : (
              <>Nothing to see here...</>
            )}
          </main>
          <footer className="w-100 flex justify-center">
            Desert By The Sea Rentals
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Developments
