import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (user) => {
  const response = await axios.post(baseUrl, user)
  return response.data
}

const update = async (user) => {
  const response = await axios.put(`${baseUrl}/${user._id}`, user)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, createNew, update, remove }