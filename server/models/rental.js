const mongoose = require('mongoose')

const rentalSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
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
  }
})

rentalSchema.statics.format = (rental) => {
  console.log('Formatting ', rental)
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

getDuration = (start, end, timeUnit) => {
  switch (timeUnit) {
    case 'year':
      return 1
    case 'month':
      return 1
    case 'week':
      return 1
    case 'day':
      return 1
    case 'hour':
      return 1
    case 'minute':
      return 1
  }
}

const Rental = mongoose.model('Rental', rentalSchema)

module.exports = Rental