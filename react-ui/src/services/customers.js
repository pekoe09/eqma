import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/customers'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const createNew = async (customer) => {
  const response = await axios.post(baseUrl, customer, getConfig())
  return response.data
}

const register = async (customer) => {
  const response = await axios.post(`${baseUrl}/register`, customer)
  return response.data
}

const update = async (customer) => {
  const response = await axios.put(`${baseUrl}/${customer._id}`, customer, getConfig())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAll, createNew, register, update, remove }