import api from './axiosClient'

export async function registerUser(payload) {
  const response = await api.post('/register', {
    email: payload.email,
    password: payload.password,
  })

  return response.data
}

export async function loginUser(payload) {
  const response = await api.post('/login?useCookies=true', {
    email: payload.email,
    password: payload.password,
  })

  return response.data
}

export async function getCurrentUser() {
  const response = await api.get('/manage/info')

  return response.data
}

export async function logoutUser() {
  const response = await api.post('/logout')

  return response.data
}

function readMessage(value) {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object') {
    return value.description || value.message || value.code || JSON.stringify(value)
  }

  return String(value)
}

export function getApiErrorMessage(error) {
  const data = error?.response?.data

  if (!data) {
    return error?.message || 'Something went wrong. Please try again.'
  }

  if (typeof data === 'string') {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(readMessage).filter(Boolean).join(' ')
  }

  if (Array.isArray(data.errors)) {
    return data.errors.map(readMessage).filter(Boolean).join(' ')
  }

  if (data.errors && typeof data.errors === 'object') {
    return Object.values(data.errors).flat().map(readMessage).filter(Boolean).join(' ')
  }

  if (data.title || data.detail) {
    return [data.title, data.detail].filter(Boolean).join(' ')
  }

  return data.message || 'Request failed. Please check your information and try again.'
}
