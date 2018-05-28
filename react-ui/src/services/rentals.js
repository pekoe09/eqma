import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/rentals'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const getMine = async () => {
  const response = await axios.get(`${baseUrl}/mine`, getConfig())
  return response.data
}

const createNew = async (rental) => {
  const response = await axios.post(baseUrl, rental, getConfig())
  return response.data
}

const createReservation = async (reservation) => {
  let response = null
  try {
    response = await axios.post(`${baseUrl}/reserve`, reservation, getConfig())
  } catch (exception) {
    console.log(exception)
  }
  return response
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

export default { getAll, getMine, createNew, createReservation, remove }