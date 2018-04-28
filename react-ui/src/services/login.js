import axios from 'axios'

const login = async (credentials) => {
  const response = await axios.post('/api/users/login', credentials)
  return response.data
}

const logout = async () => {
  await axios.post('/api/users/logout', null)
}

export default { login, logout }