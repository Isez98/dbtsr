import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import PrivateRoute from '../components/PrivateRoute'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import ContextWrapper from '../context/ContextWrapper'
import '../styles/globals.css'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Add your protected routes here
  const protectedRoutes = [
    '/',
    '/developments',
    '/owners',
    '/owner',
    '/development',
  ]
  const getLayout = Component.getLayout || ((page: ReactElement) => page)

  return getLayout(
    <PrivateRoute protectedRoutes={protectedRoutes}>
      <ContextWrapper>
        <Component {...pageProps} />
      </ContextWrapper>
    </PrivateRoute>
  )
}

export default withUrqlClient(createUrqlClient)(MyApp as NextPage<any, any>)
