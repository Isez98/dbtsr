import { withUrqlClient } from 'next-urql'
import router from 'next/router'
import React, { ReactElement, useContext } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import PageFrame from '../components/PageFrame'
import Table from '../components/Table'
import GlobalContext from '../context/GlobalContext'
import { useDevelopmentsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { NextPageWithLayout } from './_app'

export const Developments: NextPageWithLayout = ({}) => {
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
    <PageFrame title="Developments">
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
    </PageFrame>
  )
}

Developments.getLayout = function getLayout(page: ReactElement) {
  return page
}

export default withUrqlClient(createUrqlClient)(Developments)
