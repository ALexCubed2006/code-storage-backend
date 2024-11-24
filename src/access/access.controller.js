import { Router } from 'express'
import { AccessService } from './access.service.js'

const router = Router()
const accessService = new AccessService()

router.get('/isAuthorized', async (req, res) => {
	const user = await accessService.isAuthorized(req.user.id)

	if (!user) {
		return res.status(401).json({ error: '[access] Unauthorized' })
	}

	res.status(200).json(user)
})

// User roles
router.get('/isUser', async (req, res) => {
	const user = await accessService.isUser(req.user.id)

	if (!user) {
		return res.status(401).json({ error: '[access] Unauthorized' })
	}

	res.status(200).json(user)
})

router.get('/isAdmin', async (req, res) => {
	const admin = await accessService.isAdmin(req.user.id)

	if (!admin) {
		return res.status(401).json({ error: '[access] Not admin' })
	}

	res.status(200).json(admin)
})

// Group roles
router.get('/isMember', async (req, res) => {
	const member = await accessService.isMember(req.user.id)

	if (!member) {
		return res.status(401).json({ error: '[access] Not member' })
	}

	res.status(200).json(member)
})

router.get('/isModerator', async (req, res) => {
	const moderator = await accessService.isModerator(req.user.id)

	if (!moderator) {
		return res.status(401).json({ error: '[access] Not moderator' })
	}

	res.status(200).json(moderator)
})

router.get('/isGuest', async (req, res) => {
	const guest = await accessService.isGuest(req.user.id)

	if (!guest) {
		return res.status(401).json({ error: '[access] Not guest' })
	}

	res.status(200).json(guest)
})

// get access for edit profile
router.post('/editProfile', async (req, res) => {
	const access = await accessService.editProfile(req.user.id, req.body.type)

	if (!access) {
		return res.status(401).json({ error: '[access] Not accessed' })
	}
	if (access.error) {
		return res.status(401).json({ error: access.error })
	}

	res.status(200).json(access)
})

export const accessController = router
