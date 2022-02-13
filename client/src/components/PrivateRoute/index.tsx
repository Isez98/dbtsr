import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useMeQuery } from '../../generated/graphql'
import { FullPageLoader } from '../FullPageLoader'

interface PrivateRouteProps {
  protectedRoutes: string[]
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  protectedRoutes,
  children,
}) => {
  const router = useRouter()
  const [{ data, fetching }] = useMeQuery()
  const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1

  useEffect(() => {
    // user not authenticated
    if (fetching) {
    } else if (!data?.me && pathIsProtected) {
      router.push('/login')
    }
  }, [pathIsProtected, fetching])

  if (!data?.me && pathIsProtected) {
    return <FullPageLoader />
  }

  return <>{children}</>
}

export default PrivateRoute
