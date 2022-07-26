if (process.env.NODE_ENV != "production") require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const auth = require('./authentication')
const PORT = process.env.PORT || 5000


let db;
// database setup
(async () => {
  mongoose.connect(process.env.DATABASE_URI, { 
    useNewUrlParser: true,
    dbName: 'app',
  }, (initialErr) => {})
  console.log('Connected to database') 
  db = mongoose.connection
})()

const app = express()

// middleware
app.use(express.json())
  .set('views', 'views') // set the views folder
  .set('view engine', 'ejs') // set the view engine
  .use(require('cookie-parser')()) // used to have req.cookies
  .use(auth.validateUser)
  .use(express.static('public')) // set the static folder
  .use(express.urlencoded({ extended: false})) // used to accept form parameters
  // routes
  .use('/users', require('./routes/users'))
  .use('/articles', require('./routes/articles')) 
  .use('/', require('./routes/index'))
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
  

