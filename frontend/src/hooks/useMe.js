import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assignMySkill, getMe, getMySkills, removeMySkill } from '../api/meApi'

export const meQueryKey = ['me']
export const mySkillsQueryKey = ['me', 'skills']

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
  })
}

export function useMySkills() {
  return useQuery({
    queryKey: mySkillsQueryKey,
    queryFn: getMySkills,
  })
}

export function useAssignMySkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignMySkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mySkillsQueryKey })
    },
  })
}

export function useRemoveMySkill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeMySkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mySkillsQueryKey })
    },
  })
}

export function useGetMySocialLinks() {
  const queryClient = useQueryClient()

  return useQuery({
    querykey: ['me', 'socialLinks'],
    queryFn: getMySocialLinks,
  })
}

export function useCreateMySocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMySocialLink,
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['me', 'socialLinks'] })
    }
  })
}

export function useDeleteMySocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMySocialLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'socialLinks'] })
    }
  })
}