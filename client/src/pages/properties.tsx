import React, { useEffect, useState } from 'react'
import AddButton from '../components/AddButton'
import EventModal from '../components/EventModal'
import { Subjects } from '../components/EventModal/subjects'
import Table from '../components/Table'
import {
  useCreateOwnerMutation,
  usePropertiesQuery,
} from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'

export const Properties = ({}) => {
  // const router = useRouter()
  const [{ data }] = usePropertiesQuery({
    variables: { limit: 10 },
  })
  // const [ownersData, setOwnersData] = useState({})
  const [showEventModal, setShowEventModal] = useState(false)
  const [, createOwner] = useCreateOwnerMutation()

  const columns = [
    { title: 'ID', key: 'id' },
    { title: 'Designation', key: 'designation' },
    { title: 'Development', key: 'development.name' },
    { title: 'Owner', key: 'owner.name' },
  ]

  useEffect(() => console.log(data), [])

  // function onRowClick(row: any) {
  //   router.push(`owner/${row}`)
  // }

  return (
    <React.Fragment>
      {showEventModal && (
        <EventModal
          className="z-20"
          formType={Subjects.AddProperty}
          modalTitle="Add Property"
          closeEvent={() => setShowEventModal(false)}
          onSubmit={async (values, { setErrors }) => {
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
          <Table columns={columns} data={data.properties} className="p-6" />
        </>
      ) : (
        <>Nothing to see here...</>
      )}
    </React.Fragment>
  )
}

export default Properties
