import api from './axiosClient'

export async function getMySocialLinks() {
  const response = await api.get('/me/sociallinks')

  return response.data
}

export async function createMySocialLink(payload) {
  const response = await api.post('/me/sociallinks', {
    name: payload.name,
    href: payload.href,
  })

  return response.data
}

export async function getMySocialLink(socialLinkId) {
  const response = await api.get(`/me/sociallinks/${socialLinkId}`)

  return response.data
}

export async function deleteMySocialLink(socialLinkId) {
  const response = await api.delete(`/me/sociallinks/${socialLinkId}`)

  return response.data
}
