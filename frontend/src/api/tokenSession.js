import axios from 'axios'
import { clearAccessToken, getAccessToken, setAccessToken } from '../store/authStore'

let refreshPromise = null

export function saveAccessTokenFromResponse(data) {
  setAccessToken(data?.accessToken)
  return data
}

export function clearTokenSession() {
  clearAccessToken()
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post('/auth/token/refresh', null, { withCredentials: true })
      .then((response) => {
        setAccessToken(response.data.accessToken)
        return response.data.accessToken
      })
      .catch((error) => {
        clearAccessToken()
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export function attachTokenInterceptors(client) {
  client.interceptors.request.use((config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.skipAuthRefresh
      ) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const newAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return client(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    },
  )
}
