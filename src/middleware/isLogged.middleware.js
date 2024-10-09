import jwt from 'jsonwebtoken'

// if the user is not logged, redirect to login
// if the user is logged, redirect to home
export const isLoggedMiddleware = async (req, res, next) => {
	const token = req.headers?.['authorization'].split(' ')[1]

	if (token) {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		if (!decoded.id) {
			return res.status(401).json({ error: 'invalid token' })
		}

		res.json({ navigate: '/' })
		return null
	}

	next()
	return null
}
