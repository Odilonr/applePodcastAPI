import { logEvents } from "./logEvents.js";

function errorHandler (err, req, res, next) {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
  const status = err.status ? err.status : 500
  const message = status === 500 ? 'Something went wrong, try again later' : err.message
  const errors = err.error 
  res.status(status).send({status, message, error: errors})
}

export { errorHandler };