const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})

module.exports = {
  Model:  mongoose.model('User', userSchema, 'users'),
  Schema: userSchema
}