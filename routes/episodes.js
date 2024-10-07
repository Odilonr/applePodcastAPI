import express from 'express'
import {getAllEpisodesController, addEpisodeController, updateEpisodeController, 
  deleteEpisodeController, getEpisodeController
 } from '../controllers/episodeController.js'

const router = express.Router()

router.get('/', getAllEpisodesController)
router.post('/', addEpisodeController)
router.put('/:id', updateEpisodeController)
router.delete('/:id', deleteEpisodeController)

router.get('/:id', getEpisodeController)

export default router 