import { withUrqlClient } from 'next-urql'
import { ReactElement } from 'react'
import Calendar from '../components/Calendar'
import PageFrame from '../components/PageFrame'
import { createUrqlClient } from '../utils/createUrqlClient'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  return (
    <PageFrame title="Home">
      <Calendar />
    </PageFrame>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return page
}

export default withUrqlClient(createUrqlClient)(Home)
