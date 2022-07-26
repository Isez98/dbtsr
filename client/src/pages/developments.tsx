import React, { ReactElement } from 'react'
import PageFrame from '../components/PageFrame'
import Table from '../components/Table'
import { useDevelopmentsQuery } from '../generated/graphql'
import { NextPageWithLayout } from './_app'

export const Developments: NextPageWithLayout = ({}) => {
  const [{ data }] = useDevelopmentsQuery()

  const columns = [
    { title: 'Name', key: 'name' },
    { title: 'Location', key: 'location' },
  ]

  return (
    <PageFrame title="Developments">
      {data ? (
        <>
          <Table columns={columns} data={data.developments} className="p-6" />
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

export default Developments
