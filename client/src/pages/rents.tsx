import { withUrqlClient } from 'next-urql'
import React from 'react'
import { createUrqlClient } from '../utils/createUrqlClient'

export const Rents = ({}) => {
  return <React.Fragment>Rents page</React.Fragment>
}

export default withUrqlClient(createUrqlClient)(Rents)
