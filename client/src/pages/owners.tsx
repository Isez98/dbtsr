import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import Table from '../components/Table'
import GlobalContext from '../context/GlobalContext'
import { useOwnersQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

export const Owners = ({}) => {
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
    <React.Fragment>
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
    </React.Fragment>
  )
}

export default withUrqlClient(createUrqlClient)(Owners)
