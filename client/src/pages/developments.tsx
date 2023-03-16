import { withUrqlClient } from 'next-urql'
import router from 'next/router'
import React, { useState } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import { Subjects } from '../components/EventModal/subjects'
import Table from '../components/Table'
import {
  useCreateDevelopmentMutation,
  useDevelopmentsQuery,
} from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'

export const Developments = ({}) => {
  const [{ data }] = useDevelopmentsQuery({
    variables: { limit: 10 },
  })
  const [showEventModal, setShowEventModal] = useState(false)
  const [, createDevelopment] = useCreateDevelopmentMutation()

  const columns = [
    { title: 'Name', key: 'name' },
    { title: 'Location', key: 'location' },
  ]

  function onRowClick(row: any) {
    router.push(`development/${row}`)
  }

  return (
    <React.Fragment>
      {data ? (
        <>
          <AddButton onClick={() => setShowEventModal(true)} />
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
      {showEventModal && (
        <EventModal
          className="z-20"
          formType={Subjects.AddDevelopment}
          modalTitle="Add Development"
          closeEvent={() => setShowEventModal(false)}
          onSubmit={async (values, { setErrors }) => {
            const response = await createDevelopment(values)
            if (response.data?.createDevelopment.errors) {
              setErrors(toErrorMap(response.data.createDevelopment.errors))
            } else if (response.data?.createDevelopment.development) {
              //   // works
              setShowEventModal(false)
            }
          }}
          initialValues={{ name: '', location: '', logo: '' }}
        />
      )}
    </React.Fragment>
  )
}

export default withUrqlClient(createUrqlClient)(Developments)
