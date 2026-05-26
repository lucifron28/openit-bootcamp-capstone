import axios from 'axios'

const identityApi = axios.create({
  baseURL: '/auth',
  withCredentials: true,
})

export default identityApi
