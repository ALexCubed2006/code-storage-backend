import jwt from 'jsonwebtoken'

// middleware to check if the user is logged in
export const authMiddleware = (req, res, next) => {
	try {
		const token = req.headers['authorization'].split(' ')[1]
		if (!token) {
			return res.status(401).json({ error: 'invalid token' })
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		console.log(decoded, 'decoded token')
		req.user = decoded
		next()
	} catch (e) {
		res.status(401).json({ error: 'Unauthorized' })
	}
}
