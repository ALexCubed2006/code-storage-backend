import fs from 'fs'
import jwt from 'jsonwebtoken'
import { __dirname__, JWT_SIGN, prisma, TOKEN_DURATION } from '../../config.js'

// generate jwt token
// encode user id
// with secret signature
function generateToken(id) {
	return jwt.sign({ id }, JWT_SIGN, {
		expiresIn: TOKEN_DURATION,
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

	async deleteUser(id, email, password) {
		const user = await prisma.user.findUnique({
			where: {
				email,
				password,
				id,
			},
		})

		if (!user) {
			return null
		}

		await prisma.favoriteCodeFile.deleteMany({
			where: {
				userId: id,
			},
		})

		const files = await prisma.codeFile.deleteMany({
			where: {
				userId: id,
			},
		})

		for (const file of files) {
			const filePath = __dirname__ + '/public/uploads/' + file.name
			fs.unlinkSync(filePath)
		}

		await prisma.user.delete({
			where: {
				id,
			},
		})

		return {
			message: 'User deleted successfully',
		}
	}
}
