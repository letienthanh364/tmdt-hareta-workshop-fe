import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import eventApi from 'src/apis/event.api'
import { EventListQueryConfig } from '../useEventListQueryConfig'

const useEventList = (queryConfig: EventListQueryConfig) => {
  return useQuery({
    queryKey: ['events', queryConfig],
    queryFn: () => eventApi.getEventList(queryConfig),
    staleTime: 1000 * 60 * 5
  })
}

const useEventListForAdmin = (queryConfig: EventListQueryConfig) => {
  return useQuery({
    queryKey: ['events', 'admin'],
    queryFn: () => eventApi.listEventForAdmin(queryConfig),
    staleTime: 1000 * 60 * 5
  })
}

const useEventDetail = (eventId: string) => {
  return useQuery({
    queryKey: ['events', 'detail', eventId],
    queryFn: () => eventApi.getEventDetail(eventId),
    staleTime: 1000 * 60 * 5
  })
}

const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: eventApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}

const useUpdateEvent = () => useMutation({ mutationFn: eventApi.updateEvent })

const useDeleteEvent = () => useMutation({ mutationFn: eventApi.deleteEvent })

const useAddProductToEvent = () => useMutation({ mutationFn: eventApi.addProductToEvent })

const useRemoveProductFromEvent = () => useMutation({ mutationFn: eventApi.removeProductFromEvent })

export const eventQuery = {
  useEventList,
  useEventListForAdmin,
  useEventDetail,
  mutation: {
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
    useAddProductToEvent,
    useRemoveProductFromEvent
  }
}
