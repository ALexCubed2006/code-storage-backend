import jwt from 'jsonwebtoken'
import { prisma } from '../../config.js'

function generateToken(id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '24h',
	})
}

export class AuthService {
	async login(email, password) {
		const user = await prisma.user.findFirst({
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

		return {
			token,
			user,
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
