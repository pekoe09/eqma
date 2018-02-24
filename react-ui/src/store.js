import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import assetTransactionReducer from './reducers/assetTransactionReducer'
import customerReducer from './reducers/customerReducer'
import equipmentReducer from './reducers/equipmentReducer'
import userReducer from './reducers/userReducer'

const reducer = combineReducers({
  assetTransactions: assetTransactionReducer,
  customers: customerReducer,
  equipments: equipmentReducer,
  users: userReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store