import fs from 'fs'
import { prisma } from '../../config.js'

export class FileUpdateService {
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

	async addToFavorites(fileId, userId) {
		const file = await prisma.codeFile.findUnique({
			where: {
				id: fileId,
			},
		})

		if (!file) {
			return null
		}

		let favoriteCodeFile = await prisma.favoriteCodeFile.findFirst({
			where: {
				codeFileId: fileId,
				userId: userId,
			},
		})

		if (!favoriteCodeFile) {
			const newFavoriteCodeFile = await prisma.favoriteCodeFile.create({
				data: {
					codeFileId: fileId,
					userId: userId,
				},
			})
			favoriteCodeFile = newFavoriteCodeFile
		}

		const updatedFile = await prisma.codeFile.update({
			where: {
				id: fileId,
			},
			data: {
				favoriteCodeFiles: {
					connect: {
						id: favoriteCodeFile.id,
					},
				},
			},
		})

		return updatedFile
	}

	async removeFromFavorites(fileId, userId) {
		const favoriteCodeFile = await prisma.favoriteCodeFile.findFirst({
			where: {
				codeFileId: fileId,
				userId: userId,
			},
		})

		if (!favoriteCodeFile) {
			return null
		}

		await prisma.favoriteCodeFile.delete({
			where: {
				id: favoriteCodeFile.id,
			},
		})

		return true
	}
}
