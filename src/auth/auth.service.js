import jwt from 'jsonwebtoken'
import { JWT_SIGN, prisma } from '../../config.js'

// generate jwt token
// encode user id
// with secret signature
function generateToken(id) {
	return jwt.sign({ id }, JWT_SIGN, {
		expiresIn: '1d',
	})
}

export class AuthService {
	async login(email, password) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		})
		if (!user) {
			return null
		}
		if (user.password !== password) {
			return null
		}

		const token = generateToken(user.id)
		const { password: _, ...userWithoutPassword } = user

		return {
			token,
			user: userWithoutPassword,
		}
	}

	async register(email, password, name) {
		const userExists = await prisma.user.findFirst({
			where: {
				email,
			},
		})
		if (userExists) {
			return null
		}
		const user = await prisma.user.create({
			data: {
				email,
				password,
				name,
			},
		})

		const token = generateToken(user.id)

		return {
			token,
			user,
		}
	}
}
