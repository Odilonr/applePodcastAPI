import createError from 'http-errors'
import { missingData } from "./utils/missingData.js";
import { getAllShows, addShow, getShowByName, getShowById, updateShow, deleteShow} from '../queries/showQueries.js';

async function getAllShowsController (req, res) {
  const allShows = await getAllShows()
  if (!allShows) {
    return res.status(204).json({'message':'No Shows Found'})
  }
  res.json(allShows)
}

async function addShowController (req, res) {
  const {name, description, profileImage, releaseSchedule, studio, hostName} = req.body
  const missing = missingData(name, description, profileImage, releaseSchedule, studio, hostName)
  if (!name || !description || !profileImage || !releaseSchedule || !studio || !hostName) {
    throw createError(400, 'message', `${missing} required.`)
  }

  const duplicateShow = await getShowByName(name)

  if (duplicateShow) {
    throw createError(409, 'Show already Exists')
  }

  const newShow = await addShow({
    name: name,
    description: description,
    profileImage: profileImage,
    releaseSchedule: releaseSchedule,
    studio: studio,
    hostName: hostName,
    hostImage: req.body.hostImage,
    stars: req.body.stars,
    count: req.body.count,
    showType: req.body.showType,
    rated: req.body.rated
  })
  res.status(201).json(newShow)
}

async function updateShowControler(req, res) {
  const showID = req.params.id
  const updates = req.body
  const show = await getShowById(showID)
  //const show = await Show.findById(req.params.id)

  if(!show) {
    throw createError(409, `Show with ${req.params.id} not found`)
  }

  /*
  const updateKeys = Object.keys(updates)
  for (let key of updateKeys) {
    show[key] = updates[key]
  }*/

  await updateShow(showID, updates)
  //await show.save()
  res.status(201).json(show)
}

async function deleteShowController (req, res) {
  const id = req.params.id
  const show = await getShowById(id)
  if(!show) {
    throw createError(404, `Show not found`)
  }
  const result = await deleteShow(id)
  //await Show.deleteOne(show)
  res.status(201).json(show)
}

async function getShowController (req, res) {
  const id = parseInt(req.params.id)
  const show = await getShowById(req.params.id)
  if (!show) {
    throw createError(404, "Show not found")
  }
  res.json(show)
}


export { getAllShowsController, addShowController, updateShowControler, deleteShowController, getShowController } 