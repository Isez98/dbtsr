import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import Wrapper from '../../components/Wrapper'
import { useOwnerQuery } from '../../generated/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'

export const owner = ({}) => {
  const router = useRouter()
  const [{ data }] = useOwnerQuery({
    variables: { id: Number(router.query.owner_id) },
  })
  return (
    <React.Fragment>
      <div>
        <Wrapper>
          <div className="flex justify-between">
            <h1>{`Name: ${data?.owner?.name}`}</h1>
            <span>
              <span>{`Email: ${data?.owner?.email}`}</span>
              <span>{` | Phone: ${data?.owner?.phone}`}</span>
            </span>
          </div>
          <br />
          <h3>Properties:</h3>
          <div className="mt-8 flex w-full justify-center">
            <button className="mx-auto rounded-full bg-blue-300 p-2">
              Add property
            </button>
          </div>
        </Wrapper>
      </div>
    </React.Fragment>
  )
}

export default withUrqlClient(createUrqlClient)(owner)
