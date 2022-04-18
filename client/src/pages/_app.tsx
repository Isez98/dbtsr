import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PrivateRoute from '../components/PrivateRoute'
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useState, useMemo } from 'react'
import { SizeContext } from '../utils/sizeContext'

function MyApp({ Component, pageProps }: AppProps) {
  const [size, setSize] = useState(false)
  const sizeValue = useMemo(() => ({ size, setSize }), [size, setSize])
  // Add your protected routes here
  const protectedRoutes = ['/', '/developments', '/owners']

  return (
    <PrivateRoute protectedRoutes={protectedRoutes}>
      <SizeContext.Provider value={sizeValue}>
        <Component {...pageProps} />
      </SizeContext.Provider>
    </PrivateRoute>
  )
}

export default withUrqlClient(createUrqlClient)(MyApp)
