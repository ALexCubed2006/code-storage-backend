import { Router } from 'express'
import { AccessService } from './access.service.js'

const router = Router()
const accessService = new AccessService()

router.get('/isLogged', async (req, res) => {
	const user = await accessService.isLogged(req.user.id)

	if (!user) {
		return res.status(401).json({ error: 'Unauthorized' })
	}

	res.status(200).json(user)
})

router.get('/isAdmin', async (req, res) => {
	const admin = await accessService.isAdmin(req.user.id)

	if (!admin) {
		return res.status(401).json({ error: 'Not admin' })
	}

	res.status(200).json(admin)
})

export const accessController = router
