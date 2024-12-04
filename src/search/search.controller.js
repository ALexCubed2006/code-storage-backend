import { Router } from 'express'
import { SearchService } from './search.servise.js'

const router = Router()
const searchService = new SearchService()

router.get('/searchFiles', async (req, res) => {
	if (!req.user) {
		return res.status(401).json('[changeData] Unauthorized')
	}

	const { query, skip = 0, amount = 10 } = req.query

	const files = await searchService.searchFiles(query, skip, amount)

	if (!files) {
		return res.json({ error: '[searchFiles] No files found' })
	}
	res.json(files)
})

export const searchController = router
