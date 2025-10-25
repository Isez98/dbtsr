import { HTTPMethods } from '../enums'
import { useAPI } from '../utils'
import type { IOwnerData, APIResponse, OwnersListResponse } from '../types'

// Owner API hooks
export const useGetOwnerProfile = () => {
  return useAPI<APIResponse<IOwnerData>>(HTTPMethods.GET, '/owner/profile', {
    queryKey: 'ownerProfile',
  })
}

export const useUpdateOwnerProfile = (ownerData: Partial<IOwnerData>, enabled = false) => {
  return useAPI<APIResponse<IOwnerData>>(HTTPMethods.PATCH, '/owner/profile', {
    body: ownerData,
    queryKey: 'updateOwnerProfile',
    enabled,
  })
}

export const useGetOwners = () => {
  return useAPI<OwnersListResponse>(HTTPMethods.GET, `/owners`, {
    queryKey: `listOwners`,
  })
}

export const useGetOwner = (id: number) => {
  return useAPI<APIResponse<IOwnerData>>(HTTPMethods.GET, `/owners/${id}`, {
    queryKey: `owner-${id}`,
  })
}

export const usePostOwner = (ownerData: Omit<IOwnerData, 'id'>, enabled = false) => {
  return useAPI<APIResponse<IOwnerData>>(HTTPMethods.POST, '/owners', {
    body: ownerData,
    queryKey: 'postOwner',
    enabled,
  })
}