import axios from 'axios'
const baseUrl = '/api/rentals'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (rental) => {
  const response = await axios.post(baseUrl, rental)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, createNew, remove }