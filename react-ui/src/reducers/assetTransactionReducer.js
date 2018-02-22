import assetTransactionService from '../services/assetTransactions'

const assetTransactionReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_ASSETTRANSACTIONS':
      return action.assetTransactions
    case 'CREATE_ASSETTRANSACTION':
      return store.concat(action.newAssetTransaction)
    default:
      return store
  }
}

export const createAssetTransaction = (assetTransaction) => {
  return async (dispatch) => {
    const newAssetTransaction = await assetTransactionService.createNew(assetTransaction)
    dispatch({
      type: 'CREATE_ASSETTRANSACTION',
      newAssetTransaction
    })
  }
}

export const initializeAssetTransactions = () => {
  return async (dispatch) => {
    const assetTransactions = await assetTransactionService.getAll()
    dispatch({
      type: 'INIT_ASSETTRANSACTIONS',
      assetTransactions
    })
  }
}

export default assetTransactionReducer