import express from 'express'
import dotenv from 'dotenv'
import redis from 'redis'
import cors from 'cors'
import "reflect-metadata"

import { getJobs } from './api'
import { dbConnection } from './db/lib/connect'

dotenv.config()
const app : express.Application = express()
const port = process.env.PORT || 3000
const client = redis.createClient(process.env.REDIS_URL)

app.use(cors({origin: "*"}))
app.get('/', (_, res) => {
  res.send('Testing my API!')
})

app.get('/jobs', async (_, res) => {
	client.get("cachedJobs", async (error, jobs) => {
		if (error) {
			throw error;
		}
		if (jobs) {
			res.json(JSON.parse(jobs))
		}
	})
})

app.get('/update', async (_, res) => {
	res.send(`manually triggering the update`)
  const jobs = await getJobs();
	client.set("cachedJobs", JSON.stringify(jobs))
}) 

app.get('/connect', async (_, res) => {
	await dbConnection()
	res.send(`connected to the database?`)
}) 
app.listen(port, async () => {
	console.log(`Node is listening on port ${port}`)
})
