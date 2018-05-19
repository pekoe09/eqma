import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/equipment'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const getForRent = async () => {
  const response = await axios.get(`${baseUrl}/forrent`)
  return response.data
}

const createNew = async (equipment) => {
  const response = await axios.post(baseUrl, equipment, getConfig())
  return response.data
}

const update = async (equipment) => {
  const response = await axios.put(`${baseUrl}/${equipment._id}`, equipment, getConfig())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAll, getForRent, createNew, update, remove }