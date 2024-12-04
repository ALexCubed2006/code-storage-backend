import { Router } from 'express'
import { AuthService } from '../auth/auth.service.js'

const authService = new AuthService()
const router = Router()

// navigation routes
router.get('/redirectLogin', async (req, res) => {
	res.json({
		navigate: '/login',
	})
})
router.get('/redirectRegister', async (req, res) => {
	res.json({
		navigate: '/register',
	})
})

// login routes
router.post('/login', async (req, res) => {
	const { email, password } = req.body

	const { token, user } = await authService.login(email, password)
	if (!user) {
		res.status(401).json({ error: '[login] Unauthorized' })
		return null
	}

	res.json({ token, user })
})

router.post('/register', async (req, res) => {
	const { email, password, name } = req.body

	const user = await authService.register(email, password, name)
	if (!user) {
		res.status(400).json({ error: '[register] User already exists' })
		return null
	}
	res.json(user)
})

router.delete('/deleteUser', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[auth] Unauthorized' })
	}

	const deleted = await authService.deleteUser(
		req.user.id,
		req.body.email,
		req.body.password,
	)

	if (!deleted) {
		return res.status(404).json({ error: '[auth] User not found' })
	}

	res.json(deleted)
})

export const authController = router
