import dockerConsole, { Containers } from '../helpers/docker.js'

export default async function pretest() {
	try {
		const docker = dockerConsole()
		await docker.stopContainer(Containers.postgres)
	} catch (error) {
		console.error(error)
	}
}

await pretest()
