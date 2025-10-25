export type Login = {
  email: string
  password: string
}

export interface IUserData {
  name: string
  email: string
  activated: boolean
}

export interface IOwnerData {
  id: number
  name: string
  email: string
}

export interface IOwner {
  name: string
  email: string
}

export interface IMovie {
  id: number
  title: string
  year: number
  runtime: string
  genres: string[]
}

// API Response types
export interface APIResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// Specific response types for different endpoints
export interface OwnersListResponse {
  owners: IOwnerData[]
}

export interface PaginatedResponse<T> {
  data: T[]
  metadata: {
    current_page: number
    page_size: number
    first_page: number
    last_page: number
    total_records: number
  }
}

export type FieldError = {
  field: string
  message: string
}

export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: string
}

// Extended column definition with onClick support
export interface ClickableColumnDef<TData> {
  onClick?: (row: TData, cellValue: unknown) => void;
}

// Re-export ColumnDef with our extension
export type ExtendedColumnDef<TData> = import('@tanstack/react-table').ColumnDef<TData> & ClickableColumnDef<TData>;