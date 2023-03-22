import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import AddButton from '../../components/AddButton'
import EventModal from '../../components/EventModal'
import { Subjects } from '../../components/EventModal/subjects'
import Table from '../../components/Table'
import {
  useCreatePropertyMutation,
  useDevelopmentsQuery,
  useOwnerPropertiesQuery,
  useOwnerQuery,
} from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { toErrorMap } from '../../utils/toErrorMap'

export const owner = ({}) => {
  const router = useRouter()
  const [{ data: owner }] = useOwnerQuery({
    variables: { id: Number(router.query.owner_id) },
  })
  const [{ data: properties }] = useOwnerPropertiesQuery({
    variables: { id: Number(router.query.owner_id), limit: 10 },
  })
  const [showEventModal, setShowEventModal] = useState(false)
  const [, createProperty] = useCreatePropertyMutation()
  const [{ data: developments }] = useDevelopmentsQuery({
    variables: { limit: 20 },
  })
  const columns = [
    { title: 'ID', key: 'id' },
    { title: 'Designation', key: 'designation' },
    { title: 'Development', key: 'development.name' },
    { title: 'Owner', key: 'owner.name' },
  ]

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <h1>{`Name: ${owner?.owner?.name}`}</h1>
        <span>
          <span>{`Email: ${owner?.owner?.email}`}</span>
          <span>{` | Phone: ${owner?.owner?.phone}`}</span>
        </span>
      </div>
      <br />

      <h3>Properties:</h3>
      <div className="mt-2">
        {properties ? (
          <>
            <AddButton onClick={() => setShowEventModal(true)} />
            <Table
              columns={columns}
              data={properties?.ownerProperties}
              className="p-6"
            />
          </>
        ) : (
          <>Nothing to see here...</>
        )}
      </div>
      {showEventModal && (
        <EventModal
          className=""
          formType={Subjects.AddPropertyOwner}
          closeEvent={() => setShowEventModal(false)}
          modalTitle={`Add Property To ${owner?.owner?.name}`}
          onSubmit={async (values: any, { setErrors }: any) => {
            values.ownerId = Number(router.query.owner_id)
            values.developmentId = Number(values.developmentId)
            const response = await createProperty(values)
            if (response.data?.createProperty.errors) {
              setErrors(toErrorMap(response.data.createProperty.errors))
            } else if (response.data?.createProperty.propertyRental) {
              //   // works
              setShowEventModal(false)
            }
          }}
          initialValues={{
            ownerId: owner?.owner?.name,
            designation: '',
            developmentId: developments?.developments[0].id,
            notes: '',
            album: '',
          }}
        />
      )}
    </React.Fragment>
  )
}

export default withUrqlClient(createUrqlClient)(owner)
