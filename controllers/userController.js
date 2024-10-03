import { User } from "../model/Users.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import  createError  from 'http-errors'

async function registerNewUser (req, res) {
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) {
    throw createError(400, 'Username and password required')
  }
  const duplicate = await User.findOne({ username: username }).exec()
  if (duplicate) {
    throw createError(409, 'Invalid Credentials')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await User.create({
    "username": username,
    "password": hashedPassword
  })
  console.log(result)
  res.status(201).json({"message": `New user ${username} created`})
  
}

async function authenticateUser (req, res) {
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) {
    throw createError(400, 'Username and password required')
  }

  const foundUser = await User.findOne({ username: username }).exec()
  if (!foundUser) {
    throw createError(401, 'Rrong Username or password')
  }
  const passwordMatch = await bcrypt.compare(password, foundUser.password)
  if (passwordMatch){
    const roles = Object.values(foundUser.roles)
    const accessToken = jwt.sign(
      {
        "UserInfo":
          {
            "username": foundUser.username,
            "roles": roles
          }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn : '60s'}
    )
    const refreshToken = jwt.sign(
      {"username": foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    foundUser.refreshToken = refreshToken
    await foundUser.save()
    res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000})
    res.json({ accessToken })
  } else {
    throw createError(401, 'Wrong Username or Password')
  }
}

async function refreshToken (req, res) {
  const cookies = req.cookies
  if (!(cookies && cookies.jwt)) {
    throw createError(400)
  }
  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({refreshToken: refreshToken}).exec()
  if (!foundUser) {
    throw createError(403)
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) {
        return res.sendStatus(403)
      }
      const roles = Object.values(foundUser.roles)
      const accessToken = jwt.sign(
        {
          "UserInfo" : {
            "username": decoded.username,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15min' }
      )
      res.json({ accessToken })
    }
  )
}

async function logOutUser (req, res) {
  const cookies = req.cookies
  if (!(cookies && cookies.jwt)) {
    return res.sendStatus(304)
  }
  const refreshToken = cookies.jwt


  const foundUser = await User.findOne({refreshToken: refreshToken}).exec()
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true})
    return res.sendStatus(204)
  }
  foundUser.refreshToken = ''
  await foundUser.save()

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'})
  res.sendStatus(204)
}

export {registerNewUser, authenticateUser, refreshToken, logOutUser}

