if (process.env.NODE_ENV != "production") require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const auth = require('./authentication')
const error = require('./error')
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

app.get('/e', (req, res, next) => {
  res.status(500)
  next('my error')
})

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
  .use(error.handle400)
  .use(error.handle500)
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
  

