import express from 'express';
import { getJobs } from './api'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (_, res) => {
  res.send('hey!')
})

app.get('/jobs', async (_, res) => {
  const jobs = await getJobs();
  res.json(jobs)
})

app.listen(port, () => {
	console.log(`Node is listening on port ${port}`)
})
