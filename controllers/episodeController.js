import { getShowByName } from "../queries/showQueries.js";
import { getAllEpisodes, getEpByTitleShowId , getEpisodeById, addEpisode, updateEpisode, 
  deleteEpisode } from "../queries/episodeQueries.js"
import createError from "http-errors"

async function getAllEpisodesController (req, res) {
  const allEpisodes = await getAllEpisodes()
  if (!allEpisodes) {
    return res.status(204).json({'message':'No Episodes Found'})
  }
  res.json(allEpisodes)
}

async function addEpisodeController(req, res) {
  const {
    title, description, audio_link, date_added, duration, showName
  } = req.body

  if (!title || !description || !audio_link || !date_added || !duration || !showName) {
    throw createError(400, 'Missing Required Data')
  }

  const show = await getShowByName(showName)

  if (!show) {
    throw createError(404, 'SHow does not exist')
  }

  const duplicateEpisode = await getEpByTitleShowId(title, show.id)

  if (duplicateEpisode) {
    throw createError(409, 'Episode already exits')
  }

  const newEpisode = await addEpisode({
    title: title, 
    description: description,
    audio_link: audio_link,
    date_added: date_added, 
    duration: duration, 
    show_id: show.id
  })

  res.status(201).json(newEpisode)

}

async function updateEpisodeController(req, res) {
  const episodeID = req.params.id
  const updates = req.body
  const episode = await getEpisodeById(episodeID)
  if(!episode) {
    throw createError(409, `Episode with not found`)
  }
  const result = await updateEpisode(episodeID, updates)
  res.status(201).json(result)
}

async function deleteEpisodeController(req, res) {
  const id = req.params.id
  const episode = await getEpisodeById(id)
  if(!episode) {
    throw createError(404, `Episode not found`)
  }
  const result = await deleteEpisode(id)
  res.status(201).json(episode)
}

async function getEpisodeController(req, res) {
  const id = req.params.id
  const episode = await getEpisodeById(id)
  if (!episode) {
    throw createError(404, 'Show not found')
  }
  res.json(episode)
} 


export { getAllEpisodesController, addEpisodeController, updateEpisodeController, deleteEpisodeController, 
  getEpisodeController
}