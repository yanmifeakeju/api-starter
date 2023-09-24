import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

const dbName = 'newProject'

async function main() {
	await client.connect()
	console.log('Connected successfully to server')
	const db = client.db(dbName)
	const collection = db.collection('documents')
	console.log(collection)

	console.log('done')
	process.exit(0)
}

await main()
