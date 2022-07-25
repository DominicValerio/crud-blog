const User = require('../models/user').Model
const router = require('express').Router()
const auth = require('../authentication')


router.get('/register', (req, res) => {
  res.render('pages/register')
})

router.post('/register', async (req, res) => {
  try {
    const username = req.body.username
    if (!username) throw new Error("name was not provided to API")
    const password = req.body.password
    if (!password) throw new Error("password was not provided to API")
    if (await User.findOne({name: username}).lean()) res.status(400).render("pages/register", {message: "Username already exists", username: username, password: password})

    const user = new User({
      name: username,
      password: auth.hashPassword(password, process.env.SALT),
    })
    const newUser = await user.save()
    res.status(201).redirect(`${req.baseUrl}/login`)
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

router.post('/signout', (req, res) => {
  res.clearCookie('access-token')
  res.redirect('/')
})

router.get('/login', (req, res) => {
  res.render('pages/login')
})

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body
    const user = await User.findOne({name: username}).exec()
    if (user) {
      const [salt, hash] = user.password.split(':')
      if(auth.compare(auth.hashPassword(password, salt), user.password)) {
        const accesstoken = auth.createToken(user)

        res.cookie('access-token', accesstoken, {
          maxAge: 1000 * 60 * 60 * 24, // 24 hours
        })
        return res.redirect("/")
      }
      else {
        res.status(400)
        return res.render("pages/login", {message: "Wrong password", username: username, password: password})
      }
    } 
    res.status(400)
    return res.render("pages/login", {message: "No user with name " + username, username: username, password: password})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

module.exports = router


