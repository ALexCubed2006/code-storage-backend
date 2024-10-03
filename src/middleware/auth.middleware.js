import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
	try {
		const token = req.headers['authorization'].split(' ')[1]
		if (!token) {
			return res.status(401).json({ error: 'Unauthorized' })
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		console.log(decoded, 'decoded')
		req.user = decoded
		next()
	} catch (e) {
		res.status(401).json({ error: 'Unauthorized' })
	}
}
