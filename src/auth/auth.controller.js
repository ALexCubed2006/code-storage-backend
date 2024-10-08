import { Router } from 'express'
import { AuthService } from '../auth/auth.service.js'

const authService = new AuthService()
const router = Router()

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

router.post('/login', async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		res.status(400).json({ error: 'Email and password are required' })
		return null
	}

	const { token, user } = await authService.login(email, password)
	if (!user) {
		res.status(401).json({ error: 'Unauthorized' })
		return null
	}

	res.json({ token, user })
})

router.post('/register', async (req, res) => {
	const { email, password, name } = req.body

	const user = await authService.register(email, password, name)
	if (!user) {
		res.status(400).json({ error: 'User already exists' })
	} else res.json(user)
})

export const authController = router
