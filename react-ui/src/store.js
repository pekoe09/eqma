import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import userReducer from './reducers/userReducer'
import equipmentReducer from './reducers/equipmentReducer'

const reducer = combineReducers({
  users: userReducer,
  equipments: equipmentReducer 
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store