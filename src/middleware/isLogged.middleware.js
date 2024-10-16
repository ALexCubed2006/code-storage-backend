import jwt from 'jsonwebtoken'
import { JWT_SIGN } from '../../config.js'

// if the user is not logged, redirect to login
// if the user is logged, redirect to home
export const isLoggedMiddleware = async (req, res, next) => {
	const token = req.headers?.['authorization'].split(' ')[1]

	if (token) {
		try {
			// verify token
			// if the token is invalid, it will throw an error
			const decoded = jwt.verify(token, JWT_SIGN)
			if (!decoded.id) {
				return res.status(401).json({ error: '[logger] invalid token' })
			}
		} catch (e) {
			return res.status(401).json({ error: '[logger] invalid token' })
		}

		// if the user is logged, redirect to home
		res.json({ navigate: '/' })
		return null
	}

	// if the user is not logged, redirect to login / register
	next()
	return null
}
