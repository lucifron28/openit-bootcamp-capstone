import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../api/authApi'

const authQueryKey = ['auth', 'me']

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const currentUserQuery = useQuery({
    queryKey: authQueryKey,
    queryFn: getCurrentUser,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey })
      navigate('/dashboard', { replace: true })
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: authQueryKey })
      navigate('/login', {
        replace: true,
        state: { registrationSuccess: true },
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, null)
      queryClient.removeQueries({ queryKey: authQueryKey })
      navigate('/login', { replace: true })
    },
  })

  const user = currentUserQuery.data ?? null

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: currentUserQuery.isLoading,
    loginMutation,
    registerMutation,
    logoutMutation,
  }
}
