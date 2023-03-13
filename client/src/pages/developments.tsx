import { withUrqlClient } from 'next-urql'
import router from 'next/router'
import React, { useContext } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import Table from '../components/Table'
import GlobalContext from '../context/GlobalContext'
import { useDevelopmentsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

export const Developments = ({}) => {
  const [{ data }] = useDevelopmentsQuery({
    variables: { limit: 10 },
  })
  const { showEventModal } = useContext(GlobalContext)

  const columns = [
    { title: 'Name', key: 'name' },
    { title: 'Location', key: 'location' },
  ]

  function onRowClick(row: any) {
    router.push(`development/${row}`)
  }

  return (
    <React.Fragment>
      {showEventModal && <EventModal className="z-20" formType="Development" />}
      {data ? (
        <>
          <AddButton />
          <Table
            columns={columns}
            data={data.developments}
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

export default withUrqlClient(createUrqlClient)(Developments)
