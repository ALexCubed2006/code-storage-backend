import { prisma } from '../../config.js'

// class for check
// if the user have role (access)
// to do something
export class AccessService {
	// ----- is user authorized -----
	async isAuthorized(id) {
		const { name, email, role, groupRole, phoneNumber } =
			await prisma.user.findUnique({
				where: {
					id,
				},
			})

		if (!email) {
			return null
		}

		return {
			name,
			email,
			phoneNumber,
			role,
			groupRole,
		}
	}

	// ----- User roles -----
	async isUser(id) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (user.role !== 'USER') {
			return null
		}

		return user
	}

	async isAdmin(id) {
		const admin = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (admin.role !== 'ADMIN') {
			return null
		}

		return admin
	}

	// ----- Group roles -----
	async isOwner(id) {
		const owner = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (owner.role !== 'OWNER') {
			return null
		}

		return owner
	}

	async isMember(id) {
		const member = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (member.role !== 'MEMBER') {
			return null
		}

		return member
	}

	async isModerator(id) {
		const moderator = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (moderator.role !== 'MODERATOR') {
			return null
		}

		return moderator
	}

	async isGuest(id) {
		const guest = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (guest.role !== 'GUEST') {
			return null
		}

		return guest
	}

	async isBanned(id) {
		const banned = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (banned.role !== 'BANNED') {
			return null
		}

		return banned
	}

	// ----- Edit profile -----
	async editProfile(id, type) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		console.log(type)

		if (!user) {
			return null
		}

		if (type === 'name') {
			return {access: true}
		}

		if (type === 'phoneNumber') {
			return {access: true}
		}

		if (type === 'role') {
			if (user.role !== 'ADMIN') {
				return { error: '[access] Not admin' }
			}
			return {access: true}
		}

		if (type === 'email') {
			if (user.role !== 'ADMIN') {
				return { error: '[access] Not admin' }
			}
			return {access: true}
		}

		if (type === 'password') {
			if (user.role !== 'ADMIN') {
				return { error: '[access] Not admin' }
			}
			return {access: true}
		}

		return null
	}
}
