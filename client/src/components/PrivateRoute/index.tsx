import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useLogoutMutation, useMeQuery } from '../../generated/graphql'
import { isServer } from '../../utils/isServer'
import protectedRoutes from '../../utils/protectedRoutes'
import { FullPageLoader } from '../FullPageLoader'

interface PrivateRouteProps {}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const router = useRouter()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })
  const [{ fetching: logoutFetching }] = useLogoutMutation()
  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1

  useEffect(() => {
    // user not authenticated
    if (fetching) {
    } else if (!data?.me && pathIsProtected) {
      router.push('/login')
    }
  }, [pathIsProtected, fetching, logoutFetching])

  if (!data?.me && pathIsProtected) {
    if (data?.me === null) {
      router.push('/login?next=' + router.pathname)
    }
    return <FullPageLoader />
  }

  return <>{children}</>
}

export default PrivateRoute
