import { Router } from 'express'
import { prisma } from '../../config.js'
import { UploadService } from './upload.service.js'

const router = Router()
const uploadService = new UploadService()

router.post('/file', async (req, res) => {
	if (!req.files) {
		return res.status(400).json('[data] No file uploaded')
	}
	if (!req.user) {
		return res.status(401).json('[data] Unauthorized')
	}

	const file = req.files.file
	const user = await prisma.user.findUnique({
		where: { id: req.user.id },
		select: {
			id: true,
			email: true,
			name: true,
		},
	})

	const uploadedFile = await uploadService.uploadFile(file, user)

	res.json(uploadedFile)
})

export const dataController = router
