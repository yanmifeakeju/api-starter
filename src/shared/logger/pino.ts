import p from 'pino'
import { type UserTypes } from '../../core/index.js'

const pino = p.default

const logger = pino({
	serializers: {
		user: function userSerializer(user: UserTypes.User) {
			return { id: user.userId, lastLogin: user.lastLogin }
		},
	},
})

// Export a create logger function

export { logger }
