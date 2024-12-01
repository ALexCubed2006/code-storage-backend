import fs from 'fs'
import { prisma } from '../../config.js'

export class FileUpdateService {
	async updateFileName(fileId, newName) {
		const file = await prisma.codeFile.findUnique({
			where: {
				id: fileId,
			},
		})
		console.log(file)

		if (!file) {
			return null
		}

		try {
			// FIXME: fix
			return
			const fileInfo = file.name.split('-').slice(0, -1).join('-')
			const fileExtension = file.name.split('.').slice(-1)[0]
			console.log(fileInfo, newName)
			const newPath =
				'/public/uploads/' +
				fileInfo +
				'-' +
				newName +
				'.' +
				fileExtension

			const updatedFile = await prisma.codeFile.update({
				where: {
					id: fileId,
				},
				data: {
					name: fileInfo + '-' + newName + '.' + fileExtension,
					path: newPath,
					lastUpdated: new Date().toISOString(),
				},
			})
			fs.renameSync(file.path, newPath)

			return updatedFile
		} catch (err) {
			console.log('[error] File not found - ', err)
			return null
		}
	}

	async updateIsPublic(fileId, isPublic) {
		const file = await prisma.codeFile.findUnique({
			where: {
				id: fileId,
			},
		})

		if (!file) {
			return null
		}

		try {
			const updatedFile = await prisma.codeFile.update({
				where: {
					id: fileId,
				},
				data: {
					isPublic,
				},
			})

			return updatedFile
		} catch (err) {
			console.log('[error] File not found - ', err)
			return null
		}
	}

	async updateFileRating(fileId) {
		const file = await prisma.codeFile.findUnique({
			where: {
				id: fileId,
			},
		})

		if (!file) {
			return null
		}

		try {
			const updatedFile = await prisma.codeFile.update({
				where: {
					id: fileId,
				},
				data: {
					rating: file.rating + 1,
				},
			})

			return updatedFile
		} catch (err) {
			console.log('[error] File not found - ', err)
			return null
		}
	}
}
