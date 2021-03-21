import { getConnectionManager } from 'typeorm'

export const dbConnection = (async() => {
	const connectionManager = getConnectionManager()
	const connection = connectionManager.create({
		name: "postgresDBDonnection",
		type: "postgres",
		url: process.env.DATABASE_URL,
		synchronize: true,
		logging: false,
		extra: {
			ssl: {
				rejectUnauthorized: false
			}
		}, 
		entities: [
			__dirname + "/entity/*.ts"
		]
	})

	await connection.connect()
	.then(() => console.log(`db is connected`))
	.catch((error) => console.log(`Error: ${error}`))
})
