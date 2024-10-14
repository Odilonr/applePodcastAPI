import { getUser, createUser, addRefreshToken, getUserByToken } from "../queries/userQueries.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import  createError  from 'http-errors'

async function registerNewUser (req, res) {
  const { username, password, email } = req.body

  if (!username || !password || !email) {
    throw createError(400, 'All fields are required')
  }

  const duplicateUser = await getUser(username)
  if (duplicateUser) {
    throw createError(409, 'Invalid Credentials')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    username: username,
    password: hashedPassword, 
    email: email
  }
  const results = await createUser(newUser)
  res.status(201).json({"message": `New user ${username} created`})
}

async function authenticateUser (req, res) {
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) {
    throw createError(400, 'Username and password required')
  }

  const foundUser = await getUser(username)
  console.log(foundUser)
  if (!foundUser) {
    throw createError(401, 'Wrong Username or password')
  }
  const passwordMatch = await bcrypt.compare(password, foundUser.password)
  if (passwordMatch){
    const role = foundUser.is_admin ? 'admin' : 'regular'
    const accessToken = jwt.sign(
      {  
        "userID": foundUser.id,
        "role": role  
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn : '1000s'}
    )
    const refreshToken = jwt.sign(
      {"userID": foundUser.id},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    const result = await addRefreshToken(foundUser.id, refreshToken)
    res.cookie('jwt', refreshToken, {httpOnly: true,  sameSite: 'None',secure:true, maxAge: 24 * 60 * 60 * 1000})
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
  const foundUser = await getUserByToken(refreshToken)
  if (!foundUser) {
    throw createError(403)
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.id !== decoded.userID) {
        return res.sendStatus(403)
      }
      console.log(decoded.userID)
      const role = foundUser.is_admin ? 'admin' : 'regular'
      const accessToken = jwt.sign(
        {
          "userID": decoded.userID,
          "role": role 
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1000s' }
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

  const foundUser = await getUserByToken(refreshToken)
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true})
    return res.sendStatus(204)
  }
  const result = await addRefreshToken(foundUser.id, null)

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure:true})
  res.sendStatus(204)
} 

export {registerNewUser, authenticateUser, refreshToken, logOutUser}

