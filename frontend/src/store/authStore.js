import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token || null }),
  clearAccessToken: () => set({ accessToken: null }),
}))

export function getAccessToken() {
  return useAuthStore.getState().accessToken
}

export function setAccessToken(token) {
  useAuthStore.getState().setAccessToken(token)
}

export function clearAccessToken() {
  useAuthStore.getState().clearAccessToken()
}
