import axios from 'axios'
const baseUrl = '/api/equipment'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (equipment) => {
  const response = await axios.post(baseUrl, equipment)
  return response.data
}

export default { getAll, createNew }