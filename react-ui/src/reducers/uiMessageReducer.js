const uiMessageReducer = (store = [], action) => {
  switch (action.type) {
    case 'ADD_UIMESSAGE':
      return store.concat(action.newUIMessage)
    case 'CLEAR_UIMESSAGE':
      return store.filter(m => m.content !== action.content)
    default:
      return store
  }
}

export const addUIMessage = (content, type, timeout) => {
  return async (dispatch) => {
    await dispatch({
      type: 'ADD_UIMESSAGE',
      newUIMessage: { content, type }
    })
    setTimeout(() => {
      dispatch({
        type: 'CLEAR_UIMESSAGE',
        content
      })
    }, timeout * 1000)
  }
}

export default uiMessageReducer