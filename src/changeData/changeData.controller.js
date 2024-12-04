import { Router } from 'express'
import { ChangeDataService } from './changeData.service.js'

const changeDataService = new ChangeDataService()
const router = Router()

// change profile data routes
router.put('/change-name', async (req, res) => {
	if(!req.user) {
		return res.status(401).json({ error: '[changeData] Unauthorized' })
	}
	const name = req.body.value
	console.log(name)

	const user = await changeDataService.changeName(req.user.id, name)

	if (!user) {
		res.status(400).json({ error: '[changeName] User not found' })
		return null
	}
	res.json({ success: true, ...user })
})

router.put('/change-phoneNumber', async (req, res) => {
	if(!req.user) {
		return res.status(401).json({ error: '[changeData] Unauthorized' })
	}
	const phoneNumber = req.body.value

	const user = await changeDataService.changePhoneNumber(
		req.user.id,
		phoneNumber,
	)

	if (!user) {
		res.status(400).json({ error: '[changePhoneNumber] User not found' })
		return null
	}
	res.json({ success: true, ...user })
})

router.put('/change-email', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[changeData] Unauthorized' })
	}
	const email = req.body.value

	const user = await changeDataService.changeEmail(req.user.id, email)

	if (!user) {
		res.status(400).json({ error: '[changeEmail] User not found' })
		return null
	}

	if (user.error) {
		return res.status(400).json(user.error)
	}

	res.json({ success: true, ...user })
})

router.put('/change-password', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[changeData] Unauthorized' })
	}
	const password = req.body.value

	const user = await changeDataService.changePassword(req.user.id, password)

	if (!user) {
		res.status(400).json({ error: '[changePassword] User not found' })
		return null
	}

	if (user.error) {
		return res.status(400).json(user.error)
	}

	res.json({ success: true, ...user })
})

export const changeDataController = router
