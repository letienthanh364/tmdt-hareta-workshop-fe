import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'
import { EventListConfig } from 'src/types/event.type'

export type EventListQueryConfig = {
  [key in keyof EventListConfig]: string
}

export const EVENT_LIMIT = 20

export default function useEventListQueryConfig() {
  const queryParams: EventListQueryConfig = useQueryParams()
  const queryConfig: EventListQueryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || EVENT_LIMIT
    },
    isUndefined
  )
  return queryConfig
}
