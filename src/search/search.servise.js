import { prisma } from '../../config.js'

export class SearchService {
	async searchFiles(query, skip = 0, amount = 10) {
		const files = await prisma.codeFile.findMany({
			where: {
				name: {
					contains: query,
				},
			},
			skip: +skip,
			take: +amount,
		})

		if (!files) {
			return null
		}

		return files.map((file) => {
			// converting file info for client
			const fileInfo = file.name.split('-').splice(0, 3).join('-') // email-id-time
			const name = file.name.split('-').slice(3).join('-') // file name
			return {
				...file,
				fileInfo,
				name,
			}
		})
	}

	async searchUsers(query) {
		const users = await prisma.user.findMany({
			where: {
				name: {
					contains: query,
				},
			},
		})

		if (!users) {
			return null
		}

		return users
	}

	async searchGroups(query) {
		const groups = await prisma.group.findMany({
			where: {
				name: {
					contains: query,
				},
			},
		})

		if (!groups) {
			return null
		}

		return groups
	}
}
