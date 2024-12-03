import fs from 'fs'
import {
	__dirname__,
	acceptedCodeFiles,
	prisma,
	USER_ROLES,
} from '../../config.js'

export class UploadService {
	// upload file to database
	// and upload file to public folder
	async uploadFile(file, user) {
		const { name, data } = file
		const newFileName = encodeURI(
			user.email + '-' + user.id + '-' + Date.now() + '-' + name,
		)

		// upload file to public folder
		fs.writeFileSync(__dirname__ + '/public/uploads/' + newFileName, data)

		const uploadedFile = await prisma.codeFile.create({
			data: {
				name: newFileName,
				path: '/public/uploads/' + newFileName,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		})

		// return uploaded file
		// with name, path, and file extension
		return {
			id: uploadedFile.id,
			fileName: newFileName,
			name: name,
			path: uploadedFile.path,
			fileExtension: name.split('.').slice(-1)[0],
		}
	}

	// delete file from database
	// and from public folder
	async deleteFile(fileName, userId) {
		if (!fileName) return null
		const filePath = __dirname__ + '/public/uploads/' + fileName

		try {
			// FIXME:
			// finding file in database
			const file = await prisma.codeFile.findFirst({
				where: {
					userId,
					name: fileName,
				},
			})

			//console.log(file)
			if (!file) return null

			const favorites = await prisma.favoriteCodeFile.findMany({
				where: {
					codeFileId: file.id,
				},
			})

			for (const favorite of favorites) {
				await prisma.favoriteCodeFile.delete({
					where: {
						id: favorite.id,
					},
				})
			}

			// delete file from database
			const deletedFile = await prisma.codeFile.delete({
				where: {
					id: file.id,
				},
			})
			console.log(deletedFile)

			// delete file from public folder
			fs.unlinkSync(filePath)
			return deletedFile
		} catch (err) {
			console.log('[error] File not found - ', err)
			return null
		}
	}

	// ----- FOR ADMIN ONLY -----
	// !!! DELETING ALL FILES !!!
	// !!! USE WITH CAUTION !!!
	async deleteAllFiles(userId) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
				userRole: USER_ROLES.admin,
			},
		})

		if (!user) {
			return null
		}

		try {
			const files = await prisma.codeFile.findMany({})

			for (const file of files) {
				const filePath = __dirname__ + '/public/uploads/' + file.name
				fs.unlinkSync(filePath)
				await prisma.codeFile.delete({
					where: {
						id: file.id,
					},
				})
				await prisma.favoriteCodeFile.deleteMany({
					where: {
						codeFileId: file.id,
					},
				})
			}
		} catch (err) {
			console.log('[error] File not found - ', err)
			return null
		}
	}

	// get all files from database
	// FOR ADMIN ONLY
	async getAllFiles(userId) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
				userRole: USER_ROLES.admin,
			},
		})

		if (!user) {
			return null
		}

		const files = await prisma.codeFile.findMany({})

		return files
	}

	async getUserFilesIds(userId) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			return null
		}

		const fileIds = await prisma.codeFile.findMany({
			where: {
				userId: user.id,
			},
			select: {
				id: true,
				name: true,
			},
		})

		console.log(fileIds)

		return fileIds.map((file) => {
			return {
				...file,
				name: file.name.split('-').slice(-1)[0],
			}
		})
	}

	// get user files from database
	async getUserFiles(userId, skip, amount) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			return null
		}
		if (skip < 0 || amount < 0) {
			return []
		}

		const files = await prisma.codeFile.findMany({
			// pagination values
			skip: +skip, // converting skip to number
			take: +amount, // converting amount to number

			// filtering values
			where: {
				userId: user.id,
			},
			select: {
				id: true,
				name: true,
				uploadedAt: true,
				lastUpdated: true,
				isPublic: true,
			},
		})

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

	async getRandomPublicFiles(amount) {
		const files = await prisma.codeFile.findMany({
			where: {
				isPublic: true,
			},
			select: {
				id: true,
				name: true,
			},
			take: +amount,
		})

		if (!files) {
			return null
		}
		// TODO: add random selection
		return files
	}

	async getFavoriteFiles(userId, skip, amount) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			return null
		}

		const files = await prisma.favoriteCodeFile.findMany({
			where: {
				userId: user.id,
			},
			select: {
				codeFileId: true,
			},
			skip: +skip,
			take: +amount,
		})

		if (!files) {
			return null
		}

		const fileIds = files.map((file) => {
			return file.codeFileId
		})

		const filesInfo = await prisma.codeFile.findMany({
			where: {
				id: {
					in: fileIds,
				},
			},
			select: {
				id: true,
				name: true,
				uploadedAt: true,
				lastUpdated: true,
				isPublic: true,
			},
		})

		if (!filesInfo) {
			return null
		}

		return filesInfo.map((file) => {
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

	// get file from database
	// by file id and file name
	async getFile(fileName, id) {
		const fileExtension = fileName.split('.').slice(-1)[0]
		const dbFile = await prisma.codeFile.findFirst({
			where: {
				name: fileName,
				id,
			},
		})
		const { name } = dbFile

		if (acceptedCodeFiles.includes(fileExtension)) {
			const file = fs.readFileSync(__dirname__ + dbFile.path, 'utf-8')

			return {
				name,
				fileExtension,
				dbFile,
				file,
			}
		} else {
			const file = fs.readFileSync(__dirname__ + dbFile.path, 'base64')
			// if the file extension is not in the list of code files
			// return file

			return {
				name,
				fileExtension,
				dbFile,
				file,
			}
		}
	}

	async downloadFile(fileName) {
		const file = await prisma.codeFile.findFirst({
			where: {
				name: fileName,
			},
		})

		if (!file) {
			return null
		}

		const fileContent = fs.readFileSync(__dirname__ + file.path)
		return fileContent
	}
}
