import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMySocialLink,
  deleteMySocialLink,
  getMySocialLink,
  getMySocialLinks,
} from '../api/socialLinksApi'

export const socialLinksQueryKey = ['me', 'sociallinks']

export function useMySocialLinks() {
  return useQuery({
    queryKey: socialLinksQueryKey,
    queryFn: getMySocialLinks,
  })
}

export function useMySocialLink(socialLinkId) {
  return useQuery({
    queryKey: [...socialLinksQueryKey, socialLinkId],
    queryFn: () => getMySocialLink(socialLinkId),
    enabled: Boolean(socialLinkId),
  })
}

export function useCreateMySocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMySocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialLinksQueryKey })
    },
  })
}

export function useDeleteMySocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMySocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialLinksQueryKey })
    },
  })
}
