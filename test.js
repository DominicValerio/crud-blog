const crypto = require('crypto')

let a = "password"
let b = "pas"

const secret = "STOREDKEYINDATABASE"

function hash(password, salt) {
  return crypto.scryptSync(password, salt, 32).toString('hex')
}

function databaseEntry(hashedPassword, salt) {
  return `${salt}:${hashedPassword}`
}

function hashSaltFrom(databaseEntry) {
  return databaseEntry.split(':')
}

function compare(hashAString, hashBString) {
  return crypto.timingSafeEqual(Buffer.from(hashAString), Buffer.from(hashBString))
}

const storedPassword = databaseEntry(hash(a, secret), secret)
const [salt, hashedPassword] = hashSaltFrom(storedPassword)

console.log(compare(hash(b, salt), hashedPassword))

