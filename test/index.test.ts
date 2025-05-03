import assert from 'node:assert'
import { Buffer } from 'node:buffer'
import http from 'node:http'
import { URLSearchParams } from 'node:url'
import { afterAll, describe, it } from 'vitest'
import { bodyData } from '../src/index'

const host = '127.0.0.1'
const port = 6870
const url = `http://${host}:${port}`

const server = http.createServer(async (req, res) => {
  res.setHeader('content-type', 'application/json')
  const data = await bodyData(req)
  res.end(JSON.stringify(data))
})

server.listen(port)

afterAll(() => {
  server.close()
})

describe('get Request', () => {
  it('not Request Params', async () => {
    const res = await fetch(url).then(r => r.json())
    const paramsIsObject = Object.keys(res.params).length === 0
    const bodyIsObject = Object.keys(res.body).length === 0
    assert.ok(paramsIsObject)
    assert.ok(bodyIsObject)
  })

  it('get Request Params', async () => {
    const params: Record<string, any> = { name: 'Lete', age: 18 }
    const url_params = new URLSearchParams(params).toString()
    const new_url = `${url}?${url_params}`
    const res = await fetch(new_url).then(r => r.json())
    const name = res.params.name === 'Lete'
    const age = res.params.age === '18'
    const condition = name && age
    assert.ok(condition)
  })

  it('get Request Chinese String Params (decoded)', async () => {
    const params: Record<string, any> = { name: '乐特', age: 18 }
    const url_params = new URLSearchParams(params).toString()
    const new_url = `${url}?${url_params}`
    const res = await fetch(new_url).then(r => r.json())
    const name = res.params.name === '乐特'
    const age = res.params.age === '18'
    const condition = name && age
    assert.ok(condition)
  })

  it('get Request Only key without value', async () => {
    const res = await fetch(`${url}?name=&age=`).then(r => r.json())
    const name = res.params.name === ''
    const age = res.params.age === ''
    const condition = name && age
    assert.ok(condition)
  })
})

describe('post Request', () => {
  it('post Request Params', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Lete', age: 18 }),
    }).then(r => r.json())
    const name = res.body.name === 'Lete'
    const age = res.body.age === 18
    const condition = name && age
    assert.ok(condition)
  })

  it('post Request with empty body', async () => {
    const res = await fetch(url, { method: 'POST' }).then(r => r.json())
    assert.deepStrictEqual(res.body, {})
  })

  it('post Request with invalid JSON', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not a json string',
    })
    const res = await response.json()
    assert.deepStrictEqual(res.body, {})
  })

  it('post with application/x-www-form-urlencoded', async () => {
    const body = new URLSearchParams({ name: 'Lete', age: '18' }).toString()
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    }).then(r => r.json())
    assert.equal(res.body.name, 'Lete')
    assert.equal(res.body.age, '18')
  })

  it('post with text/plain', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: 'Just a plain text',
    }).then(r => r.json())
    assert.equal(res.body.text, 'Just a plain text')
  })

  it('post JSON with charset', async () => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ lang: '中文' }),
    }).then(r => r.json())

    assert.deepStrictEqual(res.body.lang, '中文')
  })

  it('post multipart/form-data', async () => {
    const form = new FormData()
    form.append('username', 'Lete')
    form.append('age', '18')

    const res = await fetch(url, { method: 'POST', body: form }).then(r => r.json())
    assert.ok(res.body.raw.includes('form-data'))
    assert.ok(typeof res.body.raw === 'string')
  })
})

describe('multi-value parameters', () => {
  it('should handle array-like query params', async () => {
    const res = await fetch(`${url}?tags=js&tags=ts`).then(r => r.json())
    // 当前实现会覆盖重复参数，如需要数组需修改getParams实现
    assert.strictEqual(res.params.tags, 'ts')
  })
})

describe('binary Data', () => {
  it('should handle octet-stream', async () => {
    const buffer = Buffer.from([0x48, 0x65, 0x6C, 0x6C, 0x6F])
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: buffer,
    }).then(r => r.json())

    // 当前实现会返回原始字符串
    assert.ok(res.body.raw.includes('Hello'))
  })
})
