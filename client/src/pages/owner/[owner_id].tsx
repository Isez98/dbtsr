import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import { useOwnerQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'

interface ownerProps {}

export const owner: React.FC<ownerProps> = ({}) => {
  const router = useRouter()
  const [{ data }] = useOwnerQuery({
    variables: { id: Number(router.query.owner_id) },
  })
  return (
    <div>
      <div className="flex justify-around">
        <h1>{`Name: ${data?.owner?.name}`}</h1>
        <span>
          <span>{`Email: ${data?.owner?.email}`}</span>
          <span>{` | Phone: ${data?.owner?.phone}`}</span>
        </span>
      </div>
      <br />
      <h3>Properties:</h3>
    </div>
  )
}

export default withUrqlClient(createUrqlClient)(owner)
