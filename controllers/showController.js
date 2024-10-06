import createError from 'http-errors'
import { missingData } from "./utils/missingData.js";

async function getAllShows (req, res) {
  const allShows = await Show.find({})
  if (!allShows) {
    return res.status(204).json({'message':'No Shows Found'})
  }
  res.json(allShows)
}

async function addShow (req, res) {
  const {name, description, profileImage, releaseSchedule} = req.body
  const missing = missingData(name, description, profileImage, releaseSchedule)
  if (!name || !description || !profileImage || !releaseSchedule) {
    throw createError(400, 'message', `${missing} required.`)
  }

  const duplicate = await Show.findOne({ name: name }).exec()

  if (duplicate) {
    throw createError(409, 'Show already Exists')
  }

  const newShow = await Show.create({
    name: name,
    hostName: req.body.hostName,
    hostImage: req.body.hostImage,
    description: description,
    profileImage: profileImage,
    stars: req.body.stars,
    count: req.body.count,
    showType: req.body.showType,
    releaseSchedule: releaseSchedule,
    studio: req.body.studio,
    rated: req.body.rated
  })
  res.status(201).json(newShow)
}

async function updateShow(req, res) {
  const updates = req.body
  const show = await Show.findById(req.params.id)

  if(!show) {
    throw createError(409, `Show with ${req.body.id} not found`)
  }

  const updateKeys = Object.keys(updates)

  for (let key of updateKeys) {
    show[key] = updates[key]
  }

  await show.save()
  res.status(201).json(show)
}

async function deleteShow (req, res) {
  const show = await Show.findById(req.params.id)
  if(!show) {
    throw createError(404, `Show not found`)
  }
  await Show.deleteOne(show)
  res.status(201).json(show)
}

async function getShow(req, res) {
  const show = await Show.findById(req.params.id)

  if (!show) {
    throw createError(404, "Show not found")
  }

  res.json(show)
}


export { getAllShows, addShow, updateShow, deleteShow, getShow } 