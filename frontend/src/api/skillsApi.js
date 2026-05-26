import api from './axiosClient'

export async function getSkills() {
  const response = await api.get('/skills')

  return response.data
}

export async function getSkill(skillId) {
  const response = await api.get(`/skills/${skillId}`)

  return response.data
}

export async function createSkill(payload) {
  const response = await api.post('/skills', {
    name: payload.name,
  })

  return response.data
}

export async function deleteSkill(skillId) {
  const response = await api.delete(`/skills/${skillId}`)

  return response.data
}
