import assert from 'node:assert'
import { afterEach, describe, it } from 'vitest'
import { bodyData } from '../src'
import { createTestServer } from './utils/createTestServer'

const closes: (() => void)[] = []

afterEach(() => {
  for (const close of closes) {
    close()
  }
})

describe('get request', () => {
  it('should return empty params and body', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req)
      res.end(JSON.stringify(data))
    })
    closes.push(close)

    const res = await fetch(url).then(r => r.json())
    assert.deepStrictEqual(res.params, {})
    assert.deepStrictEqual(res.body, {})
  })

  it('should parse query parameters', async () => {
    const params = new URLSearchParams({ name: 'lete', age: '18' }).toString()
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req)
      res.end(JSON.stringify(data))
    })
    closes.push(close)

    const res = await fetch(`${url}?${params}`).then(r => r.json())
    assert.strictEqual(res.params.name, 'lete')
    assert.strictEqual(res.params.age, '18')
  })

  it('should handle chinese query parameters', async () => {
    const params = new URLSearchParams({ name: '乐特', age: '18' }).toString()
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req)
      res.end(JSON.stringify(data))
    })
    closes.push(close)

    const res = await fetch(`${url}?${params}`).then(r => r.json())
    assert.strictEqual(res.params.name, '乐特')
    assert.strictEqual(res.params.age, '18')
  })
})
