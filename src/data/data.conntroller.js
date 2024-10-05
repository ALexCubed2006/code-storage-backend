import { Router } from "express";
import { getFileService } from "./getFile.service";

const router = Router()
const getFileService = new getFileService()

router.post('/getFile', async (req, res) => {
    const { fileName } = req.body.fileName

    // move to service

    // if (!fileName) {
    //     res.status(400).json({ error: 'File name is required' })
    //     return null
    // }

    // const file = await prisma.codeFiles.findFirst({
    //     where: {
    //         fileName,
    //     },
    // })
    // if (!file) {
    //     res.status(404).json({ error: 'File not found' })
    //     return null
    // }

    res.json(file)
})