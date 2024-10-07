import dotenv from 'dotenv'
import express from 'express'
import { logger } from './middleware/logEvents.js'
import { errorHandler } from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/users.js'
import showRouter from './routes/shows.js'
import episodeRouter from './routes/episodes.js'
import 'express-async-errors'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3500

app.use(logger)

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

app.use('/user', userRouter)

//app.use(verifyJWT)
app.use('/shows', showRouter)
app.use('/episodes', episodeRouter)

app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})