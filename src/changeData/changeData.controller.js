import { Router } from 'express'
import { ChangeDataService } from './changeData.service.js'

const changeDataService = new ChangeDataService()
const router = Router()

// change profile data routes
router.put('/changeName', async (req, res) => {
	const { name } = req.body

	const user = await changeDataService.changeName(req.user.id, name)

	if (!user) {
		res.status(400).json({ error: '[changeName] User not found' })
		return null
	}
	res.json(user)
})

router.put('/changePhoneNumber', async (req, res) => {
	const { phoneNumber } = req.body

	const user = await changeDataService.changePhoneNumber(
		req.user.id,
		phoneNumber,
	)

	if (!user) {
		res.status(400).json({ error: '[changePhoneNumber] User not found' })
		return null
	}
	res.json(user)
})

router.put('/changeEmail', async (req, res) => {
	const { email } = req.body

	const user = await changeDataService.changeEmail(req.user.id, email)

	if (!user) {
		res.status(400).json({ error: '[changeEmail] User not found' })
		return null
	}

	if(user.error) {
		return res.status(400).json(user.error)
	}

	res.json(user)
})

router.put('/changePassword', async (req, res) => {
	const { password } = req.body

	const user = await changeDataService.changePassword(req.user.id, password)

	if (!user) {
		res.status(400).json({ error: '[changePassword] User not found' })
		return null
	}

	if(user.error) {
		return res.status(400).json(user.error)
	}

	res.json(user)
})
	

// TODO: forgot password
// TODO: reset password

export const changeDataController = router
