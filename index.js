if (process.env.NODE_ENV != "production") require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const crypto = require('crypto')
const PORT = process.env.PORT || 5000

// setup
let db = null;
(async () => {
  await mongoose.connect(process.env.DATABASE_URI, { 
    useNewUrlParser: true,
    dbName: 'app'
  })
  db = mongoose.connection
  
  console.log('Connected to database') 
})()

const app = express()

app.use(express.json())
  .use(express.static('public')) // set the static folder
  .use(express.urlencoded({ extended: false})) // used to accept form parameters
  .use('/users', require('./routes/users'))
  .use('/articles', require('./routes/articles')) 
  .use('/', require('./routes/index'))
  .set('views', 'views') // set the views folder
  .set('view engine', 'ejs') // set the view engine
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
  

