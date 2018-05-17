import axios from 'axios'
import { getConfig } from './serviceHelpers'

const baseUrl = '/api/assettransactions'

const getAll = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const createNew = async (assetTransaction) => {
  const response = await axios.post(baseUrl, assetTransaction, getConfig())
  return response.data
}

export default { getAll, createNew }