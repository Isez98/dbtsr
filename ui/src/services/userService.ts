import { HTTPMethods } from '../enums'
import { useAPI } from '../utils'
import type { IUserData, APIResponse, PaginatedResponse } from '../types'

// User API hooks
export const useGetUserProfile = () => {
  return useAPI<APIResponse<IUserData>>(HTTPMethods.GET, '/user/profile', {
    queryKey: 'userProfile',
  })
}

export const useUpdateUserProfile = (userData: Partial<IUserData>, enabled = false) => {
  return useAPI<APIResponse<IUserData>>(HTTPMethods.PATCH, '/user/profile', {
    body: userData,
    queryKey: 'updateProfile',
    enabled,
  })
}

export const useGetUsers = (page = 1, limit = 10) => {
  return useAPI<PaginatedResponse<IUserData>>(HTTPMethods.GET, `/users?page=${page}&limit=${limit}`, {
    queryKey: `users-${page}-${limit}`,
  })
}

export const useGetUser = (id: number) => {
  return useAPI<APIResponse<IUserData>>(HTTPMethods.GET, `/users/${id}`, {
    queryKey: `user-${id}`,
  })
}