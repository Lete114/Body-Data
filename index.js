const bodyData = require('body-data')

module.exports = async (req, res) => {
  res.setHeader('Content-Type','application/json; charset:utf-8;')
  const data = await bodyData(req)
  res.end(JSON.stringify(data))
}