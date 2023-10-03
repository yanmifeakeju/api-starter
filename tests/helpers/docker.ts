import { default as Docker, type default as Dockerode } from 'dockerode'
type ContainerOptionsMap = {
	mongo: Dockerode.ContainerCreateOptions
	postgres: Dockerode.ContainerCreateOptions
	redis: Dockerode.ContainerCreateOptions
}

const Containers: Record<keyof ContainerOptionsMap, Dockerode.ContainerCreateOptions> = {
	mongo: {
		name: 'test_mongo_db',
		Image: 'mongo',
		Tty: false,

		HostConfig: {
			PortBindings: {
				'27017/tcp': [{ HostIp: '0.0.0.0', HostPort: '27018' }, { HostIp: '::', HostPort: '27018' }],
			},
			AutoRemove: true,
		},
	},

	postgres: {
		name: 'test_postgres_db',
		Image: 'postgres',
		Tty: false,
		Env: ['POSTGRES_PASSWORD=postgres'],
		HostConfig: {
			PortBindings: {
				'5432/tcp': [{ HostIp: '0.0.0.0', HostPort: '5433' }, { HostIp: '::', HostPort: '5433' }],
			},
			AutoRemove: true,
		},
	},

	redis: {
		name: 'test_redis',
		Image: 'redis',
		Tty: false,
		HostConfig: {
			PortBindings: {
				'6379/tcp': [{ HostIp: '0.0.0.0', HostPort: '6380' }, { HostIp: '::', HostPort: '6380' }],
			},
			AutoRemove: true,
		},
	},
}

function dockerConsole() {
	const docker = new Docker()

	return {
		async getRunningContainer(container: Dockerode.ContainerCreateOptions) {
			const containers = await docker.listContainers()
			return containers.find(running => {
				return running.Names.some(name => name.includes(container.name!))
			})
		},
		async startContainer(container: Dockerode.ContainerCreateOptions) {
			const run = await this.getRunningContainer(container)
			if (!run) {
				await pullImage(container)
				const containerObject = await docker.createContainer(container)
				await containerObject.start()
			}
		},
		async stopContainer(container: Dockerode.ContainerCreateOptions) {
			const run = await this.getRunningContainer(container)
			if (run) {
				const containerObject = docker.getContainer(run.Id)
				await containerObject.stop()
			}
		},
	}

	async function pullImage(container: Dockerode.ContainerCreateOptions): Promise<void> {
		const pullStream = await docker.pull(container.Image!)
		return new Promise((resolve, reject) => {
			docker.modem.followProgress(pullStream, onFinish, onProgress)

			function onFinish(err: unknown) {
				if (err) reject(err)
				else resolve()
			}
		})

		function onProgress(event: unknown) {
			console.info(event)
		}
	}
}

export default dockerConsole
export { Containers }
