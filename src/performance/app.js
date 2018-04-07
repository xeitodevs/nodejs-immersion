const express = require('express')
const axios = require('axios')
const app = express()
const { startLoggingPerformance } = require('./eventLoop')
app.get('/cpu-bound', function (req, res) {
  for (let i = 0; i < 1e7; i++)
    res.send(`end task`)
})

app.get('/io-bound', async function (req, res) {
  try {
    await axios.get('https://jsonplaceholder.typicode.com/posts')
  } catch (err) {

  }
  res.send(`end task`)
})

app.listen(3000, function () {
  startLoggingPerformance()
  console.log('Example app listening on port 3000!')
})
