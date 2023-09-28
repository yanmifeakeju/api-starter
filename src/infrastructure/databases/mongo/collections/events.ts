import { connectToDatabase } from '../connection.js'

const db = await connectToDatabase()
const COLLECTION = 'events'

const collection = db.collection(COLLECTION)
await collection.createIndex({ userId: 1 }, { unique: true })
