import equipmentUnitService from '../services/equipmentUnits'

const equipmentUnitReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_EQUIPMENT_UNITS':
      return action.equipmentUnits
    case 'CREATE_EQUIPMENT_UNIT':
      return store.concat(action.newEquipmentUnit)
    case 'UPDATE_EQUIPMENT_UNIT':
      return store.map(e => e._id !== action.updatedEquipmentUnit._id ? e : action.updatedEquipmentUnit)
    case 'REMOVE_EQUIPMENT_UNIT':
      return store.filter(e => e._id !== action.id)
    default:
      return store
  }
}

export const createEquipmentUnit = (equipmentUnit) => {
  return async (dispatch) => {
    const newEquipmentUnit = await equipmentUnitService.createNew(equipmentUnit)
    dispatch({
      type: 'CREATE_EQUIPMENT_UNIT',
      newEquipmentUnit
    })
  }
}

export const updateEquipmentUnit = (equipmentUnit) => {
  return async (dispatch) => {
    const updatedEquipmentUnit = await equipmentUnitService.update(equipmentUnit)
    dispatch({
      type: 'UPDATE_EQUIPMENT_UNIT',
      updatedEquipmentUnit
    })
  }
}

export const initializeEquipmentUnits = () => {
  return async (dispatch) => {
    const equipmentUnits = await equipmentUnitService.getAll()
    dispatch({
      type: 'INIT_EQUIPMENT_UNITS',
      equipmentUnits
    })
  }
}

export const removeEquipmentUnit = (id) => {
  return async (dispatch) => {
    await equipmentUnitService.remove(id)
    dispatch({
      type: 'REMOVE_EQUIPMENT_UNIT',
      id
    })
  }
}

export default equipmentUnitReducer