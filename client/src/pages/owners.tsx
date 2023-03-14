import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import Table from '../components/Table'
import { useCreateOwnerMutation, useOwnersQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

export const Owners = ({}) => {
  const router = useRouter()
  const [{ data }] = useOwnersQuery({
    variables: { limit: 10 },
  })
  const [, createOwner] = useCreateOwnerMutation()
  // const [ownersData, setOwnersData] = useState({})
  const [showEventModal, setShowEventModal] = useState(false)

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
      {showEventModal && (
        <EventModal
          className="z-20"
          formType="Owner"
          closeEvent={() => setShowEventModal(false)}
          modalTitle="Add Owner"
          onSubmit={async (values: any, { setErrors }: any) => {
            const response = await createOwner(values)
            if (response.data?.createOwner.errors) {
              setErrors(toErrorMap(response.data.createOwner.errors))
            } else if (response.data?.createOwner.owner) {
              //   // works
              setShowEventModal(false)
            }
          }}
          initialValues={{ name: '', email: '', phone: '' }}
        />
      )}
      {data ? (
        <>
          <AddButton onClick={() => setShowEventModal(true)} />
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
