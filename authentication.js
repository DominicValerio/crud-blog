const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('./models/user').Model

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

/**
 * 
 * @param {User} user 
 * @returns {string} `accesstoken`
 */
const createToken = (user) => jwt.sign({id: user.id}, process.env.ACCESS_TOKEN_SECRET)

/**
 * 
 * Express middle ware
 */

async function validateUser(req, res, next) {
  if (!req.cookies) {
    next()
    return
  }

  const accesstoken = req.cookies["access-token"]

  if(!accesstoken) {
    //res.status(400).send(`user doesn't have access token`)
    next()
    return
  }

  try {
    const validToken = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET)
    
    if(validToken) {
      const id = jwt.decode(accesstoken)["id"]
      const user = await User.findById(id).lean()
      res.locals.user = user
    }
  } catch(err) {

  }
  next()
}

module.exports = {hashPassword, compare, validateUser, createToken}