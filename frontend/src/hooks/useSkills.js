import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSkill, deleteSkill, getSkill, getSkills } from '../api/skillsApi'

export const skillsQueryKey = ['skills']

export function useSkills() {
  return useQuery({
    queryKey: skillsQueryKey,
    queryFn: getSkills,
  })
}

export function useSkill(skillId) {
  return useQuery({
    queryKey: [...skillsQueryKey, skillId],
    queryFn: () => getSkill(skillId),
    enabled: Boolean(skillId),
  })
}

export function useCreateSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsQueryKey })
    },
  })
}

export function useDeleteSkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsQueryKey })
    },
  })
}
