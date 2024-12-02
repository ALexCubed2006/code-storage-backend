/**
 * config file
 * for all env and constant variables
 * and database client
 *
 * to start server you need create .env file
 * with all env variables
 * and DATABASE_URL:
 * 	postgresql://[username]:[your password]@localhost:[port of db]/[db name]?schema=public
 */

import { PrismaClient } from '@prisma/client'

// env variables
export const SERVER_PORT = process.env.PORT || 3000
export const SERVER_HOST = process.env.HOST || 'localhost'

// if JWT_SIGN is not found, it will throw an error
// because jwt cant validate users without signature
export const JWT_SIGN =
	process.env.JWT_SIGN ||
	(() => {
		console.warn('\n[WARNING] JWT_SIGN not found')
		console.warn('[WARNING] Cant run without JWT_SIGN\n')
		process.exit(1)
	})()

// server url constants
export const __dirname__ = 'C:/Users/admin/Desktop/code-storage-backend'
export const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}`
export const TOKEN_DURATION = '1d'

// db client export
export const prisma = new PrismaClient()

export const USER_ROLES = {
	user: 'USER',
	admin: 'ADMIN',
}
export const GROUP_ROLES = {
	owner: 'OWNER',
	member: 'MEMBER',
	moderator: 'MODERATOR',
	guest: 'GUEST',
	banned: 'BANNED',
}

export const acceptedCodeFiles = [
	'js',
	'jsx',
	'ts',
	'tsx',
	'json',
	'yaml',
	'html',
	'css',
	'md',
	'txt',
]

export const CHANGE_DATA_TYPES = {
	name: 'name',
	email: 'email',
	password: 'password',
	phoneNumber: 'phoneNumber',
	role: 'role',
	groupRole: 'groupRole',
}
