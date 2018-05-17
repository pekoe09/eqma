import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/equipmentunits'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const createNew = async (equipmentUnit) => {
  const response = await axios.post(baseUrl, equipmentUnit, getConfig())
  return response.data
}

const update = async (equipmentUnit) => {
  const response = await axios.put(`${baseUrl}/${equipmentUnit._id}`, equipmentUnit, getConfig())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAll, createNew, update, remove }