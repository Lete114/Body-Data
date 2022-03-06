const bodyData = require('../index')
const http = require('http')

const server = http.createServer(async (req, res) => {
  if (req.url === '/favicon.ico') return res.end()
  res.setHeader('Content-Type', 'application/json; charset:utf-8;')
  const data = await bodyData(req)
  console.log('data', data)
  res.end(JSON.stringify(data))
})

server.listen(6870)
