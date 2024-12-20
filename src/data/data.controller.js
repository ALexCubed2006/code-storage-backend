import { Router } from 'express'
import { prisma } from '../../config.js'
import { FileUpdateService } from './fileUpdate.servise.js'
import { UploadService } from './upload.service.js'

const router = Router()
const uploadService = new UploadService()
const fileUpdateService = new FileUpdateService()

// ----- FILE UPLOAD -----

// uploading files from frontend
// then uploading to database
// and uploading to public folder
router.post('/file', async (req, res) => {
	if (!req.files) {
		return res.json({ error: '[data] No file uploaded' })
	}
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
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
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	if (!req.body.fileName) {
		return res.status(400).json({ error: '[data] No file name provided' })
	}

	const deletedFile = await uploadService.deleteFile(
		req.body.fileName,
		req.user.id,
	)

	if (!deletedFile) {
		return res.status(404).json({ error: '[data] File not found' })
	}

	res.json(deletedFile)
})

router.get('/getAllFiles', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	const files = await uploadService.getAllFiles(req.user.id)

	if (!files) {
		return res
			.status(403)
			.json({ error: '[data] No access to get all files' })
	}

	res.json(files)
})

// ADMIN ONLY
router.delete('/deleteAllFiles', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	const deletedFiles = await uploadService.deleteAllFiles(req.user.id)

	if (!deletedFiles) {
		return res.status(403).json({
			error: '[data] No access to delete all files',
		})
	}

	res.json({ success: true })
})

router.get('/getUserFileIds', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	const ids = await uploadService.getUserFilesIds(req.user.id)

	res.json(ids)
})

router.get('/getUserFiles', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}
	const { skip = 0, amount = 10 } = req.query

	const files = await uploadService.getUserFiles(req.user.id, skip, amount)

	res.json(files)
})

router.get('/getRandomPublicFiles', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}
	const { amount = 10 } = req.query

	const files = await uploadService.getRandomPublicFiles(amount)

	res.json(files)
})

router.get('/getFavoriteFiles', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	const { skip = 0, amount = 10 } = req.query

	const files = await uploadService.getFavoriteFiles(
		req.user.id,
		skip,
		amount,
	)

	res.json(files)
})

router.post('/getFile', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	if (!req.body.fileName) {
		return res.status(400).json({ error: '[data] No file name provided' })
	}

	const file = await uploadService.getFile(req.body.fileName, req.body.id)

	if (!file) {
		return res.status(404).json({ error: '[data] File not found' })
	}

	res.json(file)
})

router.get('/downloadFile', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	if (!req.query.fileName) {
		return res.status(400).json({ error: '[data] No file name provided' })
	}

	const file = await uploadService.downloadFile(req.query.fileName)

	if (!file) {
		return res.status(404).json({})
	}

	res.download(file)
})

// ----- FILE UPDATE -----

router.put('/updateFileName', async (req, res) => {
	console.log(req.body)
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	if (!req.body.fileName) {
		return res.status(400).json({})
	}

	const updatedFile = await fileUpdateService.updateFileName(
		req.body.fileId,
		req.body.fileName,
	)

	if (!updatedFile) {
		return res.status(404).json({ error: '[data] File not found' })
	}

	res.json(updatedFile)
})

router.put('/updateIsPublic', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	if (req.body.isPublic === undefined) {
		return res.status(400).json({ error: '[data] No isPublic provided' })
	}

	const updatedFile = await fileUpdateService.updateIsPublic(
		req.body.fileId,
		req.body.isPublic,
	)

	if (!updatedFile) {
		return res.status(404).json({ error: '[data] File not found' })
	}

	res.json(updatedFile)
})

router.put('/updateFileRating', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	const updatedFile = await fileUpdateService.updateFileRating(
		req.body.fileId,
	)

	if (!updatedFile) {
		return res.status(404).json({ error: '[data] File not found' })
	}

	res.json(updatedFile)
})

router.put('/addToFavorites', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	const updatedFile = await fileUpdateService.addToFavorites(
		req.body.fileId,
		req.user.id,
	)

	if (!updatedFile) {
		return res.status(404).json({ error: '[data] File not found' })
	}

	res.json(updatedFile)
})

router.put('/removeFromFavorites', async (req, res) => {
	if (!req.user) {
		return res.status(401).json({ error: '[data] Unauthorized' })
	}

	const updatedFile = await fileUpdateService.removeFromFavorites(
		req.body.fileId,
		req.user.id,
	)

	if (!updatedFile) {
		return res.status(404).json({ error: '[data] File not found' })
	}

	res.json(updatedFile)
})

export const dataController = router
