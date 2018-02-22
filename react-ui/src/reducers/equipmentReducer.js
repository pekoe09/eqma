import equipmentService from '../services/equipments'

const equipmentReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_EQUIPMENT':
      return action.equipments
    case 'CREATE_EQUIPMENT':
      return store.concat(action.newEquipment)
    case 'REMOVE_EQUIPMENT':
      return store.filter(e => e._id !== action.id)
    default:
      return store
  }
}

export const createEquipment = (equipment) => {
  return async (dispatch) => {
    const newEquipment = await equipmentService.createNew(equipment)
    dispatch({
      type: 'CREATE_EQUIPMENT',
      newEquipment
    })
  }
}

export const initializeEquipment = () => {
  return async (dispatch) => {
    const equipments = await equipmentService.getAll()
    dispatch({
      type: 'INIT_EQUIPMENT',
      equipments
    })
  }
}

export const removeEquipment = (id) => {
  return async (dispatch) => {
    await equipmentService.remove(id)
    dispatch({
      type: 'REMOVE_EQUIPMENT',
      id
    })
  }
}

export default equipmentReducer