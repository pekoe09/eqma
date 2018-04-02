import axios from 'axios'
import { getTokenHeader } from './serviceHelpers'

const login = async (credentials) => {
  console.log('Sending login with creds ', credentials)
  const response = await axios.post('/api/users/login', credentials)
  return response.data
}

const logout = async () => {
  const tokenHeader = getTokenHeader()
  if (!tokenHeader) {
    return { error: 'cannot log out as token has not been set' }
  }
  const config = {
    headers: { 'Authorization': tokenHeader }
  }
  const response = await axios.post('/api/users/logout', null, config)
  return response.data
}

export default { login, logout }