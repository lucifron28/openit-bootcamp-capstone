import axios from 'axios'
import { attachTokenInterceptors } from './tokenSession'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

attachTokenInterceptors(api)

export default api
