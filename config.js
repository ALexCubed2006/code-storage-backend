import { PrismaClient } from "@prisma/client"

export const variables = {
    SERVER_PORT: process.env.PORT || 3000,
    SERVER_HOST: process.env.HOST || 'localhost',
    JWT_SIGN: process.env.JWT_SECRET || 'secret',
}


export const prisma = new PrismaClient()