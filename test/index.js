const http = require('http')
const { it, describe, after } = require('mocha')
const assert = require('assert')
const axios = require('axios')
const bodyData = require('../index')

const host = '127.0.0.1'
const port = 6870
const url = `http://${host}:${port}`

const server = http.createServer(async (req, res) => {
  res.setHeader('content-type', 'application/json')
  const data = await bodyData(req)
  res.end(JSON.stringify(data))
})

server.listen(port)

after(() => {
  server.close()
})

describe('Error Handling', () => {
  it('Request Params is undefined', async () => {
    const data = await bodyData()
    const isObject = Object.prototype.toString.call(data) === '[object Object]'
    assert.ok(isObject)
  })

  it('Request Params is null', async () => {
    const reg = /'Request' Parameters do not meet the requirements/g
    let error = ''
    try {
      await bodyData(null)
    } catch (e) {
      error = e.toString()
    }
    assert.ok(reg.test(error))
  })

  it('Request Params are not Object', async () => {
    const reg = /'Request' Parameters do not meet the requirements/g
    let error = ''
    try {
      await bodyData(123)
    } catch (e) {
      error = e.toString()
    }
    assert.ok(reg.test(error))
  })
})

describe('Get Request', () => {
  it('Not Request Params', async () => {
    const res = await axios.get(url)
    const isObject = Object.keys(res.data).length === 0
    assert.ok(isObject)
  })

  it('Get Request Params', async () => {
    const res = await axios.get(url, { params: { name: 'Lete', age: 18 } })
    const name = 'Lete' === res.data.name
    const age = '18' === res.data.age
    const condition = name && age
    assert.ok(condition)
  })

  it('Get Request Chinese String Params (decoded)', async () => {
    const res = await axios.get(url, { params: { name: '乐特', age: 18 } })
    const name = '乐特' === res.data.name
    const age = '18' === res.data.age
    const condition = name && age
    assert.ok(condition)
  })

  it('Get Request Only key without value', async () => {
    const res = await axios.get(url + '?name=&age=')
    const name = '' === res.data.name
    const age = '' === res.data.age
    const condition = name && age
    assert.ok(condition)
  })
})

describe('Post Request', () => {
  it('Not Request Params', async () => {
    const res = await axios.post(url)
    const isObject = Object.keys(res.data).length === 0
    assert.ok(isObject)
  })

  it('Post Request Params', async () => {
    const res = await axios.post(url, { name: 'Lete', age: 18 })
    const name = 'Lete' === res.data.name
    const age = 18 === res.data.age
    const condition = name && age
    assert.ok(condition)
  })
})
