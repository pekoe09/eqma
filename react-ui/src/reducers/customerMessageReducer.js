import customerMessageService from '../services/customerMessages'

const customerMessageReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_CUSTOMER_MESSAGES':
      return action.messages
    case 'CREATE_CUSTOMER_MESSAGE':
      return store.concat(action.newMessage)
    case 'UPDATE_CUSTOMER_MESSAGE':
      return store.map(m => m._id !== action.updatedMessage._id ? m : action.updatedMessage)
    case 'REMOVE_CUSTOMER_MESSAGE':
      return store.filter(m => m._id !== action.id)
    default:
      return store
  }
}

export const createCustomerMessage = (message) => {
  return async (dispatch) => {
    const newMessage = await customerMessageService.createNew(message)
    dispatch({
      type: 'CREATE_CUSTOMER_MESSAGE',
      newMessage
    })
  }
}

export const updateCustomerMessage = (message) => {
  return async (dispatch) => {
    const updatedMessage = await customerMessageService.update(message)
    dispatch({
      type: 'UPDATE_CUSTOMER_MESSAGE',
      updatedMessage
    })
  }
}

export const initializeCustomerMessages = () => {
  return async (dispatch) => {
    const messages = await customerMessageService.getAll()
    dispatch({
      type: 'INIT_CUSTOMER_MESSAGES',
      messages
    })
  }
}

export const removeCustomerMessage = (id) => {
  return async (dispatch) => {
    await customerMessageService.remove(id)
    dispatch({
      type: 'REMOVE_CUSTOMER_MESSAGE',
      id
    })
  }
}

export default customerMessageReducer