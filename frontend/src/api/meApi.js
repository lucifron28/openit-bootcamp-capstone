import api from './axiosClient'

export async function getMe() {
  const response = await api.get('/me')

  return response.data
}

export async function getMySkills() {
  const response = await api.get('/me/skills')

  return response.data
}

export async function assignMySkill(skillId) {
  const response = await api.post('/me/skills', { skillId })

  return response.data
}

export async function removeMySkill(skillId) {
  const response = await api.delete(`/me/skills/${skillId}`)

  return response.data
}

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

export async function deleteMySocialLink(socialLinkId) {
  const response = await api.delete(`/me/sociallinks/${socialLinkId}`)

  return response.data
}


