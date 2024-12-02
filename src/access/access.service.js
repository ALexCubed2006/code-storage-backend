import {
	CHANGE_DATA_TYPES,
	GROUP_ROLES,
	prisma,
	USER_ROLES,
} from '../../config.js'

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
		if (user.role !== USER_ROLES.user) {
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
		if (admin.role !== USER_ROLES.admin) {
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
		if (owner.role !== GROUP_ROLES.owner) {
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
		if (member.role !== GROUP_ROLES.member) {
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
		if (moderator.role !== GROUP_ROLES.moderator) {
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
		if (guest.role !== GROUP_ROLES.guest) {
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
		if (banned.role !== GROUP_ROLES.banned) {
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

		if (type === CHANGE_DATA_TYPES.name) {
			return { access: true }
		}

		if (type === CHANGE_DATA_TYPES.phoneNumber) {
			return { access: true }
		}

		if (type === CHANGE_DATA_TYPES.role) {
			if (user.role !== USER_ROLES.admin) {
				return { error: '[access] Not admin' }
			}
			return { access: true }
		}

		if (type === CHANGE_DATA_TYPES.email) {
			if (user.role !== USER_ROLES.admin) {
				return { error: '[access] Not admin' }
			}
			return { access: true }
		}

		if (type === CHANGE_DATA_TYPES.password) {
			if (user.role !== USER_ROLES.admin) {
				return { error: '[access] Not admin' }
			}
			return { access: true }
		}

		return null
	}
}
