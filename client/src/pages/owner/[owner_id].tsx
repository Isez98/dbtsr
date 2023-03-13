import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import AddButton from '../../components/AddButton'
import Table from '../../components/Table'
import { useOwnerPropertiesQuery, useOwnerQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'

export const owner = ({}) => {
  const router = useRouter()
  const [{ data: owner }] = useOwnerQuery({
    variables: { id: Number(router.query.owner_id) },
  })
  const [{ data: properties }] = useOwnerPropertiesQuery({
    variables: { id: Number(router.query.owner_id), limit: 10 },
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
            <AddButton />
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
    </React.Fragment>
  )
}

export default withUrqlClient(createUrqlClient)(owner)
