import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/customermessages'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const createNew = async (message) => {
  const response = await axios.post(baseUrl, message)
  return response.data
}

const update = async (message) => {
  const response = await axios.put(`${baseUrl}/${message._id}`, message, getConfig())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAll, createNew, update, remove }