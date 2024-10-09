import { Router } from 'express'
import { AccessService } from './access.service.js'

const router = Router()
const accessService = new AccessService()

// User roles
router.get('/isUser', async (req, res) => {
	const user = await accessService.isUser(req.user.id)

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

// Group roles
router.get('/isMember', async (req, res) => {
	const member = await accessService.isMember(req.user.id)

	if (!member) {
		return res.status(401).json({ error: 'Not member' })
	}

	res.status(200).json(member)
})

router.get('/isModerator', async (req, res) => {
	const moderator = await accessService.isModerator(req.user.id)

	if (!moderator) {
		return res.status(401).json({ error: 'Not moderator' })
	}

	res.status(200).json(moderator)
})

router.get('/isGuest', async (req, res) => {
	const guest = await accessService.isGuest(req.user.id)

	if (!guest) {
		return res.status(401).json({ error: 'Not guest' })
	}

	res.status(200).json(guest)
})

export const accessController = router
