import dockerConsole, { Containers } from '../helpers/docker.js'

async function pretest() {
	try {
		const docker = dockerConsole()
		await Promise.all(
			Object.keys(Containers).map(async (key) => {
				const containerName = key as keyof typeof Containers
				await docker.stopContainer(Containers[containerName])
			}),
		)
	} catch (error) {
		console.error(error)
	}
}

await pretest()
