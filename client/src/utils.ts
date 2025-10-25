import { useState, useEffect, useMemo } from 'react'
import {
  QueryClient,
  useQuery,
} from '@tanstack/react-query'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { HTTPMethods } from './enums'
import { useNavigate } from 'react-router-dom'

interface UseAPIOptions {
  body?: object | string | null
  queryKey?: string
  enabled?: boolean
}

export const useAPI = <T = unknown>(
  method: HTTPMethods,
  endpoint: string,
  options: UseAPIOptions = {},
): {
  loading: 'error' | 'success' | 'pending'
  queryData: T | null
  error: string | null
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<T, Error>>
} => {
  const navigate = useNavigate()
  const [queryData, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<'pending' | 'success' | 'error'>(
    'pending',
  )
  const [error, setError] = useState<string | null>(null)
  const reqHeaders = new Headers()
  reqHeaders.append('Content-Type', 'application/json')

  const auth_token = getCookie('auth')
  if (typeof auth_token !== 'undefined') {
    reqHeaders.append('Authorization', `Bearer ${auth_token}`)
  } else {
    reqHeaders.delete('Authorization')
  }

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  }), [])

  const { data, refetch } = useQuery<T>(
    {
      queryKey: [`${options.queryKey ?? 'data'}`],

      queryFn: async (): Promise<T> => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_API_ENDPOINT || 'http://localhost:4000/v1'}${endpoint}`,
            {
              method: method,
              body: options.body !== null && options.body !== undefined 
                ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
                : null,
              headers: reqHeaders,
            },
          )
          const dataResponse = await res.json()

          if (!res.ok) {
            setLoading('error')
            setError(dataResponse.error || 'Something went wrong')
            if (res.status === 401) {
              setCookie('auth', '', -1)
              navigate('/login')
            }
          }
          setLoading('success')
          return dataResponse
        } catch (error) {
          console.error(error)
          setLoading('error')
          setError(error instanceof Error ? error.message : 'Unknown error occurred')
          throw error
        }
      },
      refetchOnWindowFocus: false,
      enabled: options.enabled ?? true,
      gcTime: 30 * 1000,
    },
    queryClient,
  )

  useEffect(() => {
    setData(data ?? null)
  }, [data])

  useEffect(() => {
    if (queryData) {
      queryClient.removeQueries()
    }
  }, [queryData, queryClient])

  return { loading, queryData, error, refetch }
}

export const setCookie = (name: string, value: string, days: number) => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = `${name}=${value}${expires}; Domain=${import.meta.env.VITE_COOKIE_DOMAIN || 'localhost'}; Path=/; Secure;`
}

export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`
  const parts = value?.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts?.pop()?.split(';').shift()
  } else {
    return undefined
  }
}

export const deleteCookie = (name: string) => {
  setCookie(name, '', -1)
}

// Protected routes configuration
export const protectedRoutes = ['/dashboard', '/profile', '/settings']

// Page titles configuration
export const titles: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/register': 'Register',
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

// API endpoints configuration
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    verify: '/auth/verify',
    refresh: '/auth/refresh',
  },
  user: {
    profile: '/user/profile',
    update: '/user/update',
  },
} as const