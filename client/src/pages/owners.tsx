import { withUrqlClient } from 'next-urql'
import Head from 'next/head'
import React, { useContext, useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideMenu'
import Table from '../components/Table'
import { useOwnersQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { SizeContext } from '../utils/sizeContext'

interface OwnersProps {}

export const Owners: React.FC<OwnersProps> = ({}) => {
  const { size } = useContext(SizeContext)
  const [{ data }] = useOwnersQuery()
  // const [ownersData, setOwnersData] = useState({})

  const columns = [
    { title: 'Name', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Phone', key: 'phone' },
  ]

  return (
    <div className="h-full w-full">
      <Head>
        <title>Owners</title>
      </Head>
      <div className="flex w-full">
        <SideMenu className=" px-3" items={['home', 'developments']} />
        <div
          className={`page-container bg-white ${
            size ? 'page__widen' : 'page__shrink'
          }`}
        >
          <NavBar routes={['home', 'developments']} />
          <main className="justify-content-center container h-auto">
            {data ? (
              <Table columns={columns} data={data.owners}></Table>
            ) : (
              <>Nothing to see here...</>
            )}
            <footer>Desert By The Sea Rentals</footer>
          </main>
        </div>
      </div>
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(Owners)
