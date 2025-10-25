import { HTTPMethods } from '../enums'
import { useAPI } from '../utils'
import type { Login, IUserData, APIResponse } from '../types'

// Authentication API hooks
export const useLogin = (credentials: Login, enabled = false) => {
  return useAPI<APIResponse<{ token: string; user: IUserData }>>(HTTPMethods.POST, '/auth/login', {
    body: credentials,
    queryKey: 'login',
    enabled,
  })
}

export const useRegister = (userData: Login, enabled = false) => {
  return useAPI<APIResponse<{ token: string; user: IUserData }>>(HTTPMethods.POST, '/auth/register', {
    body: userData,
    queryKey: 'register',
    enabled,
  })
}

export const useLogout = (enabled = false) => {
  return useAPI<APIResponse<{ message: string }>>(HTTPMethods.POST, '/auth/logout', {
    queryKey: 'logout',
    enabled,
  })
}

export const useVerifyToken = () => {
  return useAPI<APIResponse<{ valid: boolean; user?: IUserData }>>(HTTPMethods.GET, '/auth/verify', {
    queryKey: 'verifyToken',
  })
}

export const useRefreshToken = (enabled = false) => {
  return useAPI<APIResponse<{ token: string }>>(HTTPMethods.POST, '/auth/refresh', {
    queryKey: 'refreshToken',
    enabled,
  })
}