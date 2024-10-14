import jwt from 'jsonwebtoken'

// middleware to check if the user is logged
export const authMiddleware = (req, res, next) => {
	try {
		const token = req.headers['authorization'].split(' ')[1]
		if (!token) {
			return res.status(401).json({ error: '[auth] invalid token' })
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		req.user = decoded
		next()
	} catch (e) {
		if (e.name === 'TokenExpiredError') {
			return res.status(200).json({ error: '[auth] token expired' })
		}
		res.status(401).json({ error: '[auth] Unauthorized', e })
	}
}
