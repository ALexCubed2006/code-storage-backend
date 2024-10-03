import { PrismaClient } from '@prisma/client'
import express from 'express'
import { accessController } from './src/access/access.controller.js'
import { authController } from './src/auth/auth.controller.js'
import { authMiddleware } from './src/middleware/auth.middleware.js'
export const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())

// CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
	next()
})
app.options('*', (req, res) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	)
	res.status(200).send()
})

async function main() {
	app.use('/api/auth', authController)
	app.use('/api/access', authMiddleware, accessController)

	app.get('/getUsers', authMiddleware, async (_, res) => {
		const users = await prisma.user.findMany({})
		console.log(users)
		res.json(users)
	})
	app.post('/setUser', async (req, res) => {
		const { email, password, name } = req.body
		const user = await prisma.user.create({
			data: {
				email,
				password,
				name,
			},
		})
		res.json(user)
	})

	app.listen(PORT, () =>
		console.log(`Server running on  http://localhost:${PORT}`),
	)
}

main()
	.then(async () => {
		await prisma.$connect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
