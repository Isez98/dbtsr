import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PrivateRoute from '../components/PrivateRoute'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import ContextWrapper from '../context/ContextWrapper'

function MyApp({ Component, pageProps }: AppProps) {
  // Add your protected routes here
  const protectedRoutes = ['/', '/developments', '/owners']

  return (
    <PrivateRoute protectedRoutes={protectedRoutes}>
      <ContextWrapper>
        <Component {...pageProps} />
      </ContextWrapper>
    </PrivateRoute>
  )
}

export default withUrqlClient(createUrqlClient)(MyApp)
