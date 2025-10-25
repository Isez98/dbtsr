export const HTTPMethods = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const

export type HTTPMethods = typeof HTTPMethods[keyof typeof HTTPMethods]

export const BannerType = {
  error: 'error',
  info: 'info',
  warning: 'warning',
  success: 'success',
} as const

export type BannerType = typeof BannerType[keyof typeof BannerType]