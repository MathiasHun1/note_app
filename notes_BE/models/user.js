const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id,
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)