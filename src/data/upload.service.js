import fs from 'fs'
import { __dirname__, prisma } from '../../config.js'

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
			// finding file in database
			const file = await prisma.codeFile.findFirst({
				where: {
					userId,
					name: fileName,
				},
			})
			if (!file) return null

			// delete file from database
			const deletedFile = await prisma.codeFile.delete({
				where: {
					name: fileName,
					id: file.id,
				},
			})

			// delete file from public folder
			fs.unlinkSync(filePath)
			return deletedFile
		} catch (err) {
			console.log('[error] File not found - ', err)
			return null
		}
	}

	// get all files from database
	async getAllFiles(userId) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		// only admin can get all files
		if (user.role !== 'ADMIN') {
			// return null if user is not admin
			return null
		}

		const files = await prisma.codeFile.findMany({})

		return files
	}

	// get user files from database
	async getUserFiles(userId) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		})

		if(!user) {
			return null
		}

		const files = await prisma.codeFile.findMany({
			where: {
				userId: user.id,
			},
		})

		return files
	}

	// get file from database
	// by file id and file name
	async getFile(fileName, id) {
		const fileExtension = fileName.split('.').slice(-1)[0]
		const codeFiles = [
			'js',
			'jsx',
			'ts',
			'tsx',
			'json',
			'yaml',
			'html',
			'css',
			'md',
			'txt',
		]
		if (codeFiles.includes(fileExtension)) {
			// TODO: create file syntax highlighting and return it as a byte array
			// maybe use https://github.com/highlightjs/highlight.js

			//  and maybe return it with a stream
		} else {
			// if the file extension is not in the list of code files
			// return file	
			const file = await prisma.codeFile.findFirst({
				where: {
					name: fileName,
					id,
				},
			})
			const { name } = file
			// TODO: send file to frontend

			return {
				name,
				fileExtension,
				file,
			}
		}
	}
}
