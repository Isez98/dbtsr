import { withUrqlClient } from 'next-urql'
import Calendar from '../components/Calendar'
import { createUrqlClient } from '../utils/createUrqlClient'

const Home = () => {
  return <Calendar />
}

export default withUrqlClient(createUrqlClient)(Home)
