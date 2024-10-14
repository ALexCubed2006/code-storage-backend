import { PrismaClient } from '@prisma/client'

export const SERVER_PORT = process.env.PORT || 3000
export const SERVER_HOST = process.env.HOST || 'localhost'
export const JWT_SIGN = process.env.JWT_SECRET || 'secret'

export const __dirname__ = 'C:/Users/admin/Desktop/code-storage-backend'
export const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}`

export const prisma = new PrismaClient()
