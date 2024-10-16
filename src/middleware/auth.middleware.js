import jwt from 'jsonwebtoken'
import { JWT_SIGN } from '../../config.js'

// middleware to check if the user is logged
export const authMiddleware = (req, res, next) => {
	try {
		const token = req.headers['authorization'].split(' ')[1]
		if (!token) {
			return res.status(401).json({ error: '[auth] invalid token' })
		}
		
		// verify token
		// if the token is invalid, it will throw an error
		const decoded = jwt.verify(token, JWT_SIGN)

		req.user = decoded
		next()
	} catch (e) {
		// if the token expired
		// it will throw an error
		if (e.name === 'TokenExpiredError') {
			return res.status(200).json({ error: '[auth] token expired' })
		}
		res.status(401).json({ error: '[auth] Unauthorized', e })
	}
}
