import { useRouter } from 'next/router'
import React from 'react'
import AddButton from '../../components/AddButton'
import Table from '../../components/Table'
import Wrapper from '../../components/Wrapper'
import {
  useDevelopmentPropertiesQuery,
  useDevelopmentQuery,
} from '../../generated/graphql'

export const development = ({}) => {
  const router = useRouter()
  const [{ data: developments }] = useDevelopmentQuery({
    variables: { id: Number(router.query.development_id) },
  })
  const [{ data: properties }] = useDevelopmentPropertiesQuery({
    variables: { id: Number(router.query.development_id), limit: 20 },
  })

  const columns = [
    { title: 'ID', key: 'id' },
    { title: 'Designation', key: 'designation' },
    { title: 'Owner', key: 'owner.name' },
  ]

  return (
    <div>
      <div className="flex justify-between">
        <h1>{`Name: ${developments?.development?.name}`}</h1>
        <span>
          <span>{`Location: ${developments?.development?.location}`}</span>
        </span>
      </div>
      {/* <br /> */}
      <h3>Properties:</h3>
      <div className="mt-2">
        {properties ? (
          <>
            <AddButton
              onClick={function (): void {
                throw new Error('Function not implemented.')
              }}
            />
            <Table
              columns={columns}
              data={properties?.developmentProperties}
              className="p-6"
            />
          </>
        ) : (
          <>Nothing to see here...</>
        )}
      </div>
    </div>
  )
}

export default development
