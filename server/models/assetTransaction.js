const mongoose = require('mongoose')

const assetTransactionSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    isRequired: true
  },
  date: {
    type: Date,
    isRequired: true
  },
  type: {
    type: String,
    isRequired: true
  },
  value: {
    type: Number,
    isRequired: true
  },
  description: {
    type: String,
    isRequired: true
  },
  isDeleted: {
    type: Boolean,
    isRequired: true
  },
  predecessor: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetTransaction'
  },
  successor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetTransaction'
  }
})

const AssetTransaction = mongoose.model('AssetTransaction', assetTransactionSchema)

module.exports = AssetTransaction