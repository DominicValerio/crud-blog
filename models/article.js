const mongoose = require('mongoose')
const user = require('./user.js')

const articleSchema = new mongoose.Schema({
  author: {
    type: user.Schema,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  }
})

module.exports = {
  Model:  mongoose.model('Post', articleSchema, 'articles'),
  Schema: articleSchema
}