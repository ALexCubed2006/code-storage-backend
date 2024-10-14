import express from 'express'
import fileUpload from 'express-fileupload'
import { prisma, SERVER_HOST, SERVER_PORT } from './config.js'
import { accessController } from './src/access/access.controller.js'
import { authController } from './src/auth/auth.controller.js'
import { dataController } from './src/data/data.controller.js'
import { authMiddleware } from './src/middleware/auth.middleware.js'
import { isLoggedMiddleware } from './src/middleware/isLogged.middleware.js'
import { validateMiddleware } from './src/middleware/validate.middleware.js'

const app = express()

// global middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// file upload
app.use(fileUpload({}))

// CORS(cross origin resource sharing) for local development
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	)
	next()
})
app.options('*', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	)
	res.status(200).send()
})

async function main() {
	// main routes of app
	app.use('/api/auth', validateMiddleware, authController)
	app.use('/api/redirect', isLoggedMiddleware, authController)
	app.use('/api/access', authMiddleware, accessController)
	app.use('/api/upload', authMiddleware, dataController)

	// test routes
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
		const files = await prisma.codeFile.findMany({})
		res.json(files)
	})

	// start server on SERVER_HOST : SERVER_PORT
	app.listen(SERVER_PORT, () =>
		console.log(`Server running on  http://${SERVER_HOST}:${SERVER_PORT}`),
	)
}

main()
