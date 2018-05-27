import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/rentals'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const createNew = async (rental) => {
  const response = await axios.post(baseUrl, rental, getConfig())
  return response.data
}

const createReservation = async (reservation) => {
  const response = await axios.post(`${baseUrl}/reserve`, reservation, getConfig())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAll, createNew, createReservation, remove }