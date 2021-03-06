const mongoose = require('mongoose')
const moment = require('moment')

const rentalSchema = new mongoose.Schema({
  equipmentUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentUnit',
    isRequired: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    isRequired: true
  },
  start: {
    type: Date,
    isRequired: true
  },
  end: Date,
  timeUnit: {
    type: String,
    isRequired: true
  },
  price: {
    type: Number,
    isRequired: true
  },
  isReservation: Boolean
})

rentalSchema.statics.format = (rental) => {
  let totalPrice = 0
  if (rental.end) {
    let duration = getDuration(rental.start, rental.end, rental.timeUnit)
    totalPrice = duration * rental.price
  }
  return {
    ...rental,
    totalPrice
  }
}

const getDuration = (start, end, timeUnit) => {
  let timeDiff = moment(end).diff(moment(start))
  switch (timeUnit) {
    case 'year':
      return timeDiff / (1000 * 60 * 60 * 24 * 365)
    case 'month':
      return timeDiff / (1000 * 60 * 60 * 24 * 30)
    case 'week':
      return timeDiff / (1000 * 60 * 60 * 24 * 7)
    case 'day':
      return timeDiff / (1000 * 60 * 60 * 24)
    case 'hour':
      return timeDiff / (1000 * 60 * 60)
    case 'minute':
      return timeDiff / (1000 * 60 * 60)
  }
  return null
}

const Rental = mongoose.model('Rental', rentalSchema)

module.exports = Rental