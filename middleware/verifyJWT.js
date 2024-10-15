import jwt from 'jsonwebtoken'

function verifyJWT (req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization
  if(!authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401)
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        console.log(`the error: ${err}`)
        return res.sendStatus(403)
      }
      req.user = decoded.userID
      req.role = decoded.role
      next()
    }
  ) 
      
  
}

export { verifyJWT }