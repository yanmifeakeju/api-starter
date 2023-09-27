import dockerConsole, { Containers } from '../helpers/docker.js'

async function pretest() {
	const docker = dockerConsole()
	await Promise.all(
		Object.keys(Containers).map(async (key) => {
			const containerName = key as keyof typeof Containers
			await docker.startContainer(Containers[containerName])
		}),
	)
	setTimeout(() => console.log('CHILL'), 5000) // wait a five seconds before starting test
}

await pretest()
