import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'
import { ImageListConfig } from 'src/types/image.type'

export type ImageListQueryConfig = {
  [key in keyof ImageListConfig]: string
}

export const IMAGE_LIMIT = 20

export default function useImageListQueryConfig() {
  const queryParams: ImageListQueryConfig = useQueryParams()
  const queryConfig: ImageListQueryConfig = omitBy(
    {
      time_from: queryParams.time_from,
      time_to: queryParams.time_to,
      page: queryParams.page || 1,
      limit: queryParams.limit || IMAGE_LIMIT
    },
    isUndefined
  )
  return queryConfig
}
