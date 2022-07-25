const user = require('../models/user')
const User = user.Model
const router = require('express').Router()
const crypto = require('crypto')


// routes
router.get('/register', (req, res) => {
  res.render('pages/register')
})

router.post('/register', async (req, res) => {
  try {
    const username = req.body.username
    if (!username) throw new Error("name was not provided to API")
    if (await User.find({name: username}).exec().length > 0) throw new Error("User with username already exists")
    const password = req.body.password
    if (!password) throw new Error("password was not provided to API")
    const user = new User({
      name: username,
      password: hashPassword(password, process.env.SALT),
    })
    const newUser = await user.save()
    res.status(201).redirect(`${req.baseUrl}/login`)
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

router.get('/login', (req, res) => {
  res.render('pages/login')
})

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body
    const users = await User.find({name: username}).exec()
    const user = users[0]
    if (user) {
      const [salt, hash] = user.password.split(':')
      if(compare(hashPassword(password, salt), user.password)) {
        return res.render("pages/login", {message: "Sucess"})
      }
      else {
        return res.render("pages/login", {message: "Wrong password", username: username, password: password})
      }
    } 
    return res.render("pages/login", {message: "No user with name " + username})
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

// router.get('/:username', findUser, (req, res) => {
//   res.json(res.user)
// })

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

// password logic
function hashPassword(password, salt) {
  const hashed = crypto.scryptSync(password, salt, 32).toString('base64')
  return `${salt}:${hashed}`
}

/**
 * @param {String} hashA
 * @param {String} hashB 
 */
function compare(hashA, hashB) {
  return crypto.timingSafeEqual(Buffer.from(hashA), Buffer.from(hashB))
}

module.exports = router