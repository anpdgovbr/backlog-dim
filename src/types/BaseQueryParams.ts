export interface BaseQueryParams {
  page: number
  pageSize: number
  search?: string
  orderBy?: string
  ascending?: boolean
}

export interface BasePaginatedResponse<T> {
  data: T[]
  total: number
}
