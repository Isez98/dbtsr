import { withUrqlClient } from 'next-urql'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import NavBar from '../components/NavBar'
import SideMenu from '../components/SideMenu'
import Table from '../components/Table'
import GlobalContext from '../context/GlobalContext'
import { useOwnersQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

interface OwnersProps {}

export const Owners: React.FC<OwnersProps> = ({}) => {
  const { size } = useContext(GlobalContext)
  const router = useRouter()
  const [{ data }] = useOwnersQuery({
    variables: { limit: 10 },
  })
  // const [ownersData, setOwnersData] = useState({})
  const { showEventModal } = useContext(GlobalContext)

  const columns = [
    { title: 'ID', key: 'id' },
    { title: 'Name', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Phone', key: 'phone' },
  ]

  function onRowClick(row: any) {
    router.push(`owner/${row}`)
  }

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
            {showEventModal && <EventModal className="z-20" formType="Owner" />}
            {data ? (
              <>
                <AddButton />
                <Table
                  columns={columns}
                  data={data.owners}
                  rowClick={onRowClick}
                  className="p-6"
                />
              </>
            ) : (
              <>Nothing to see here...</>
            )}
            <footer className="w-100 flex justify-center">
              Desert By The Sea Rentals
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(Owners)
