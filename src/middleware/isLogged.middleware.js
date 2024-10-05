import jwt from 'jsonwebtoken'
import { prisma } from '../../index.js'

// if the user is not logged in, redirect to login
// if the user is logged in, redirect to home
export const isLoggedMiddleware = async (req, res, next) => {
	try {
		const token = req.headers['authorization'].split(' ')[1]
		if (!token) {
            console.log('token not found')
            next()
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
			},
		})

		if (user.id) {
            console.log('user found')
            res.json('/')
			return null
		} else {
            console.log('no user found')
			next()
		}
	} catch (e) {
        console.log(e)
        console.log('no token')
		next()
	}
}
