import jwt from 'jsonwebtoken'

// if the user is not logged in, redirect to login
// if the user is logged in, redirect to home
export const isLoggedMiddleware = async (req, res, next) => {
	const token = req.headers?.['authorization'].split(' ')[1]

	if (token) {
		try {
			jwt.verify(token, process.env.JWT_SECRET)
			res.json({ navigate : '/' })
		} catch (e) {
			res.status(401).json({ error: 'invalid token' })
		}
		return null
	} 

	next()
	return null
}
