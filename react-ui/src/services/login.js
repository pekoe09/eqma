import axios from 'axios'

const login = async (credentials) => {
  console.log('Sending login with creds ', credentials)
  const response = await axios.post('/api/users/login', credentials)
  return response.data
}

const logout = async () => {
  const response = await axios.post('/api/users/logout')
  return response.data
}

export default { login, logout }