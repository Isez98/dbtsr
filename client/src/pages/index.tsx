import { withUrqlClient } from 'next-urql'
import Calendar from '../components/Calendar'
import { createUrqlClient } from '../utils/createUrqlClient'
// import { useRentsQuery } from '../generated/graphql'
// import { useEffect } from 'react'

const Home = () => {
  return <Calendar />
}

export default withUrqlClient(createUrqlClient)(Home)
