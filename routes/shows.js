import express from 'express'
import { getAllShowsController, addShowController, updateShowController, 
  deleteShowController, getShowController} from '../controllers/showController.js'

const router = express.Router()

router.get('/', getAllShowsController)
router.post('/', addShowController)
router.put('/:id', updateShowController)
router.delete('/:id', deleteShowController)

router.get('/:id', getShowController)

export default router 