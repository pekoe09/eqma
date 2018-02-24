import axios from 'axios'
const baseUrl = '/api/customers'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (customer) => {
  const response = await axios.post(baseUrl, customer)
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`)
  return response.data
}

export default { getAll, createNew, remove }