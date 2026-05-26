import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../api/authApi'

const authQueryKey = ['auth', 'me']

export function useAuth({ checkCurrentUser = true } = {}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const currentUserQuery = useQuery({
    queryKey: authQueryKey,
    queryFn: getCurrentUser,
    enabled: checkCurrentUser,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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
    onSuccess: (_data, variables) => {
      const email = variables.email.trim().toLowerCase()

      queryClient.resetQueries({ queryKey: authQueryKey })
      navigate('/login', {
        replace: true,
        state: { registrationSuccess: true, email },
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

  const user = checkCurrentUser
    ? currentUserQuery.data ?? null
    : queryClient.getQueryData(authQueryKey) ?? null

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: checkCurrentUser && currentUserQuery.isLoading,
    loginMutation,
    registerMutation,
    logoutMutation,
  }
}
