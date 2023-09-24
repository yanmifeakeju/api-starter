import dockerConsole, { Containers } from '../helpers/docker.js'

export default async function pretest() {
  const docker = dockerConsole()
  await docker.startContainer(Containers.postgres)
  setTimeout(() => console.log('resting'), 5000) // wait a five seconds before starting test
}

await pretest()
