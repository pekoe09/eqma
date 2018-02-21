import userService from '../services/users'

const userReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.users
    case 'CREATE_USER':
      return store.concat(action.newUser)
    default:
      return store
  }
}

export const createUser = (user) => {
  return async (dispatch) => {
    const newUser = await userService.createNew(user)
    dispatch({
      type: 'CREATE_USER',
      newUser
    })
  }
}

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      users
    })
  }
}

export default userReducer