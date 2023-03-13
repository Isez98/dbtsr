import { NextPage } from 'next'
import type { AppProps, AppContext } from 'next/app'
import PrivateRoute from '../components/PrivateRoute'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import ContextWrapper from '../context/ContextWrapper'
import '../styles/globals.css'
import { useRouter } from 'next/router'
import PageFrame from '../components/PageFrame'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <PrivateRoute>
      <ContextWrapper>
        <PageFrame title={router.pathname}>
          <Component {...pageProps} />
        </PageFrame>
      </ContextWrapper>
    </PrivateRoute>
  )
}

export default withUrqlClient(createUrqlClient)(MyApp)
