import api from './axiosClient'

export async function getGigPosts() {
  const response = await api.get('/gigposts')

  return response.data
}

export async function getGigPost(gigPostId) {
  const response = await api.get(`/gigposts/${gigPostId}`)

  return response.data
}

export async function createGigPost(payload) {
  const response = await api.post('/gigposts', {
    title: payload.title,
    description: payload.description,
  })

  return response.data
}

export async function updateGigPost(gigPostId, payload) {
  const response = await api.patch(`/gigposts/${gigPostId}`, {
    title: payload.title,
    description: payload.description,
  })

  return response.data
}

export async function deleteGigPost(gigPostId) {
  const response = await api.delete(`/gigposts/${gigPostId}`)

  return response.data
}
