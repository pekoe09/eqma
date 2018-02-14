const mongoose = require('mongoose')

const shopSchema = new mongoose.Schema({
  name: String,
  abbreviation: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: String,
  loc: {
    type: [Number],
    index: '2d'
  }
})

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop