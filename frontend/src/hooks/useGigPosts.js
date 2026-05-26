import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createGigPost,
  deleteGigPost,
  getGigPost,
  getGigPosts,
  updateGigPost,
} from '../api/gigPostsApi'

export const gigPostsQueryKey = ['gigposts']

export function useGigPosts() {
  return useQuery({
    queryKey: gigPostsQueryKey,
    queryFn: getGigPosts,
  })
}

export function useGigPost(gigPostId) {
  return useQuery({
    queryKey: [...gigPostsQueryKey, gigPostId],
    queryFn: () => getGigPost(gigPostId),
    enabled: Boolean(gigPostId),
  })
}

export function useCreateGigPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGigPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gigPostsQueryKey })
    },
  })
}

export function useUpdateGigPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gigPostId, payload }) => updateGigPost(gigPostId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: gigPostsQueryKey })
      queryClient.invalidateQueries({ queryKey: [...gigPostsQueryKey, variables.gigPostId] })
    },
  })
}

export function useDeleteGigPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGigPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gigPostsQueryKey })
    },
  })
}
