import fs from 'fs'
import { __dirname__ } from '../../config.js'
import { prisma } from '../../config.js'

export class UploadService {
	async uploadFile(file, user) {
		const { name, data } = file
		const newFileName = encodeURI(
			user.email + '-' + user.id + '-' + Date.now() + '-' + name,
		)

		fs.writeFileSync(__dirname__ + '/public/uploads/' + newFileName, file.data)

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

		return {
			name: newFileName,
			path: uploadedFile.path,
			data,
		}
	}

	async deleteFile(fileName) {
		const filePath = __dirname__ + '/public/uploads/' + fileName
		if (filePath) {
			try {
				await prisma.codeFile.delete({
					where: {
						name: fileName,
					},
				})

				fs.unlinkSync(filePath)
				console.log('File has been deleted')
			} catch (err) {
				console.log(err)
			}
		}
	}
}
