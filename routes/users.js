const user = require('../models/user')
const User = user.Model
const router = require('express').Router()
const crypto = require('crypto')

// routes
router.post('/', async (req, res) => {
  try {
    const name = req.body.name
    if (!name) throw new Error("name was not provided to API")
    const password = req.body.password
    if (!password) throw new Error("password was not provided to API")
    const encrypted = crypto.createHash('sha256', password).digest('hex')
    const user = new User({
      name: name,
      password: encrypted,
    })
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

router.get('/login', (req, res) => {
  res.render('pages/login')
})

router.get('/:userId', findUser, (req, res) => {
  res.json(res.user)
})

router.delete('/:userId', findUser, async (req, res) => {
  try {
    await res.user.remove()
    res.json({message: `Deleted user ${res.user.name}`})
  } catch(err) {
    res.status(500).json({message: err.message})
  }
})

// middleware
async function findUser(req, res, next) {
  try {
    const user = await User.findById(req.params.userId)
    if(user == null) {
      return res.status(404).json({message: "Couldn't find user"})
    }
    res.user = user
  } catch(err) {
    if (mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(500).json({message: err.message})
    } else {
      return res.status(404).json({message: "Couldn't find user. Id doesn't have the correct length or format"})
    }
  }
  next()
}

module.exports = router