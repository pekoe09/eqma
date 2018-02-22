import axios from 'axios'
const baseUrl = '/api/assettransactions'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (assetTransaction) => {
  const response = await axios.post(baseUrl, assetTransaction)
  return response.data
}

export default { getAll, createNew }