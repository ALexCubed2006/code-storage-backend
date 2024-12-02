import { prisma, USER_ROLES } from '../../config.js'

export class ChangeDataService {
	async changeName(id, name) {
		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				name,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				groupRole: true,
				phoneNumber: true,
			},
		})

		if (!user) {
			return null
		}

		return user
	}

	async changePhoneNumber(id, phoneNumber) {
		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				phoneNumber,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				groupRole: true,
				phoneNumber: true,
			},
		})

		if (!user) {
			return null
		}

		return user
	}

	// for now for admin only
	async changePassword(id, password) {
		const isAdmin = await prisma.user.findUnique({
			where: {
				id,
			},
		})

		if (!isAdmin) {
			return null
		}

		if (isAdmin.role !== USER_ROLES.admin) {
			return { error: '[access] Not admin' }
		}

		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				password,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				groupRole: true,
				phoneNumber: true,
			},
		})

		if (!user) {
			return null
		}

		return user
	}

	// for now for admin only
	async changeEmail(id, email) {
		const isAdmin = await prisma.user.findUnique({
			where: {
				id,
			},
		})

		if (!isAdmin) {
			return null
		}

		if (isAdmin.role !== USER_ROLES.admin) {
			return { error: '[access] Not admin' }
		}

		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				email,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				groupRole: true,
				phoneNumber: true,
			},
		})

		return user
	}

	// for admin only
	async changeRole(id, role) {
		const isAdmin = await prisma.user.findUnique({
			where: {
				id,
			},
		})

		if (!isAdmin) {
			return null
		}

		if (isAdmin.role !== USER_ROLES.admin) {
			return { error: '[access] Not admin' }
		}

		const user = await prisma.user.update({
			where: {
				id,
			},
			data: {
				role,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				groupRole: true,
				phoneNumber: true,
			},
		})

		return user
	}
}
