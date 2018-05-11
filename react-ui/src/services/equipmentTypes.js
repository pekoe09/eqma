import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/equipmenttypes'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const createNew = async (equipmentType) => {
  const response = await axios.post(baseUrl, equipmentType, getConfig())
  return response.data
}

const update = async (equipmentType) => {
  const response = await axios.put(`${baseUrl}/${equipmentType._id}`, equipmentType, getConfig())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAll, createNew, update, remove }