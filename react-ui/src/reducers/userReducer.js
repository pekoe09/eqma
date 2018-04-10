import userService from '../services/users'

const userReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.users
    case 'CREATE_USER':
      return store.concat(action.newUser)
    case 'UPDATE_USER':
      return store.map(u => u._id !== action.updatedUser.id ? u : action.updatedUser)
    case 'REMOVE_USER':
      return store.filter(u => u._id !== action.id)
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

export const updatedUser = (user) => {
  return async (dispatch) => {
    const updatedUser = await userService.update(user)
    dispatch({
      type: 'UPDATE_USER',
      updatedUser
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

export const removeUser = (id) => {
  return async (dispatch) => {
    await userService.remove(id)
    dispatch({
      type: 'REMOVE_USER',
      id
    })
  }
}

export default userReducer