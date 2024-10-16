import { Router } from 'express'
import { prisma } from '../../config.js'
import { UploadService } from './upload.service.js'

const router = Router()
const uploadService = new UploadService()

// uploading files from frontend
// then uploading to database
// and uploading to public folder
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

// deleting files from database
// and deleting from public folder
router.delete('/deleteFile', async (req, res) => {
	if (!req.user) {
		return res.status(401).json('[data] Unauthorized')
	}

	if (!req.body.fileName) {
		return res.status(400).json('[data] No file name provided')
	}

	const deletedFile = await uploadService.deleteFile(
		req.body.fileName,
		req.user.id,
	)

	if (!deletedFile) {
		return res.status(404).json('[data] File not found')
	}

	res.json(deletedFile)
})

router.get('/getAllFiles', async (req, res) => {
	if (!req.user) {
		return res.status(401).json('[data] Unauthorized')
	}

	const files = await uploadService.getAllFiles(req.user.id)

	if (!files) {
		return res.status(403).json('[data] No access to get all files')
	}

	res.json(files)
})

router.post('/getFile', async (req, res) => {
	if (!req.user) {
		return res.status(401).json('[data] Unauthorized')
	}

	if (!req.body.fileName) {
		return res.status(400).json('[data] No file name provided')
	}

	const file = await uploadService.getFile(req.body.fileName, req.body.id)

	if (!file) {
		return res.status(404).json('[data] File not found')
	}

	res.json(file)
})

export const dataController = router
