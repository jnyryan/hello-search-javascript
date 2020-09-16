const express = require('express')
const dataloader = require('./data-loader.js')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('ok')
})

app.get('/transform', (req, res) => {
  let data = dataloader.loadXml();
  res.json({status: "ok"})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})