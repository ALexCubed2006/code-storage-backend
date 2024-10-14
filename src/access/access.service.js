import { prisma } from '../../config.js'

export class AccessService {
	async isAuthorized(id) {
		const { name, email, role, groupRole } = await prisma.user.findUnique({
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
			role,
			groupRole,
		}
	}

	// User roles
	async isUser(id) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (user.role !== 'user') {
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
		if (admin.role !== 'admin') {
			return null
		}

		return admin
	}

	// Group roles
	async isOwner(id) {
		const owner = await prisma.user.findUnique({
			where: {
				id,
			},
		})
		if (owner.role !== 'owner') {
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
		if (member.role !== 'member') {
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
		if (moderator.role !== 'moderator') {
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
		if (guest.role !== 'guest') {
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
		if (banned.role !== 'banned') {
			return null
		}

		return banned
	}
}
