import express from 'express'
import { accessController } from './src/access/access.controller.js'
import { authController } from './src/auth/auth.controller.js'
import { authMiddleware } from './src/middleware/auth.middleware.js'
import { isLoggedMiddleware } from './src/middleware/isLogged.middleware.js'
import { prisma } from './config.js'
import { variables } from './config.js'

const app = express()

app.use(express.json())

// CORS(cross origin resource sharing) for local development
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
	app.use('/api/redirect', isLoggedMiddleware, authController)
	app.use('/api/access', authMiddleware, accessController)

	// for test and debug
	app.get('/getUsers', async (_, res) => {
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

	app.get('/getGroups', async (_, res) => {
		const groups = await prisma.group.findMany({})
		console.log(groups)
		res.json(groups)
	})

	app.post('/setGroup', async (req, res) => {
		const { name } = req.body
		const user = await prisma.group.findMany({
			where: {
				id: 1,
			},
		})
		const group = await prisma.group.create({
			data: {
				name,
				users: {
					connect: user,
				},
			},
		})
		res.json(group)
	})

	app.post('/addUserToGroup', async (req, res) => {
		const { userId, groupId } = req.body
		const user = await prisma.group.update({
			where: {
				id: groupId,
			},
			data: {
				users: {
					connect: {
						id: userId,
					},
				},
			},
		})
		res.json(user)
	})

	app.get('/getFiles', async (_, res) => {
		const files = await prisma.codeFiles.findMany({})
		console.log(files)
		res.json(files)
	})

	// start server on localhost:PORT
	app.listen(variables.SERVER_PORT, () =>
		console.log(`Server running on  http://localhost:${variables.SERVER_PORT}`),
	)
}

main()
