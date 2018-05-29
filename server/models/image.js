const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  },
  name: {
    type: String,
    isRequired: true
  },
  caption: {
    type: String,
    isRequired: true
  },
  mainImageKey: {
    type: String,
    isRequired: true
  },
  thumbnailKey: {
    type: String,
    isRequired: true
  },
  isPublic: {
    type: Boolean,
    isRequired: true
  }
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image