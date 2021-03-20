import express from 'express';
import totalJobs from './api/index'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('hey!')
})

app.get('/jobs', (req, res) => {
  res.json(totalJobs)
})

app.listen(port, () => {
  console.log(`Listening on http://localhost${port}`)
})
