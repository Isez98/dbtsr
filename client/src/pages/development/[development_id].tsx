import { useRouter } from 'next/router'
import React from 'react'
import Wrapper from '../../components/Wrapper'
import { useDevelopmentQuery } from '../../generated/graphql'

export const development = ({}) => {
  const router = useRouter()
  const [{ data }] = useDevelopmentQuery({
    variables: { id: Number(router.query.development_id) },
  })
  return (
    <React.Fragment>
      <div>
        <Wrapper>
          <div className="flex justify-between">
            <h1>{`Name: ${data?.development?.name}`}</h1>
            <span>
              <span>{`Location: ${data?.development?.location}`}</span>
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

export default development
