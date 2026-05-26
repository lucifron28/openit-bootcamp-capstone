import axios from 'axios'
import { attachTokenInterceptors } from './tokenSession'

const identityApi = axios.create({
  baseURL: '/auth',
  withCredentials: true,
})

attachTokenInterceptors(identityApi)

export default identityApi
