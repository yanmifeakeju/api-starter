import { MongoClient } from 'mongodb'
import { env } from '../../../config/env/env.js'

const url = env.MONGO_URI
const dbName = env.MONGO_STORE

const client = new MongoClient(url)

async function connectToDatabase() {
	try {
		await client.connect()
		console.log('Connected to MongoDB')

		const db = client.db(dbName)

		// Ensure that the required collections/indexes are created here
		// Example: await db.collection('users').createIndex({ email: 1 }, { unique: true });

		return db
	} catch (error) {
		console.error('Error connecting to MongoDB:', error)
		throw error // Rethrow the error for proper handling in the application
	}
}

async function closeDatabaseConnection() {
	try {
		await client.close()
		console.log('MongoDB connection closed')
	} catch (error) {
		console.error('Error closing MongoDB connection:', error)
	}
}

export { closeDatabaseConnection, connectToDatabase }
