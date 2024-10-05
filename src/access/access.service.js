import { prisma } from '../../index.js'

export class AccessService {
	async isLogged(id) {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
		})
        if (!user) {
            return null
        }
        
        return user
	}
    async isAdmin(id) {
        const admin = await prisma.user.findUnique({
            where: {
                id,
            },
        })
        if (!admin.role !== 'admin') {
            return null
        }
        
        return admin
    }
}
