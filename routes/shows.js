import express from 'express'
import { getAllShowsController, addShowController, updateShowControler, 
  deleteShowController, getShowController} from '../controllers/showController.js'

const router = express.Router()

router.get('/', getAllShowsController)
router.post('/', addShowController)
router.put('/:id', updateShowControler)
router.delete('/:id', deleteShowController)

router.get('/:id', getShowController)

export default router 