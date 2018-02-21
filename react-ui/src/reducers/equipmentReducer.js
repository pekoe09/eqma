import equipmentService from '../services/equipments'

const equipmentReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_EQUIPMENT':
      return action.equipments
    case 'CREATE_EQUIPMENT':
      return store.concat(action.newEquipment)
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

export default equipmentReducer