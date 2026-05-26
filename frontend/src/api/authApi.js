import identityApi from './identityClient'

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export async function registerUser(payload) {
  const response = await identityApi.post('/register', {
    email: normalizeEmail(payload.email),
    password: payload.password,
  })

  return response.data
}

export async function loginUser(payload) {
  const response = await identityApi.post('/login?useCookies=true', {
    email: normalizeEmail(payload.email),
    password: payload.password,
  })

  return response.data
}

export async function getCurrentUser() {
  const response = await identityApi.get('/manage/info')

  return response.data
}

export async function logoutUser() {
  const response = await identityApi.post('/logout')

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
  if (error?.response?.status === 401) {
    return 'Invalid email or password.'
  }

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
