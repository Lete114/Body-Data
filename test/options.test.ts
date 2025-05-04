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

describe('bodyData with additional options', () => {
  it('should return raw body data when raw option is true', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req, { raw: true })
      res.end(JSON.stringify(data))
    })
    closes.push(close)
    const body = 'Hello, World!'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
    }).then(r => r.json())

    assert.ok(res.body.raw.includes(body))
  })

  it('should handle different encodings (UTF-8)', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req, { encoding: 'utf-8' })
      res.end(JSON.stringify(data))
    })
    closes.push(close)
    const body = 'Hello, 世界!' // Example with non-ASCII characters
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body,
    }).then(r => r.json())

    assert.ok(res.body.text === body)
  })

  it('should handle different encodings (Latin1)', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req, { encoding: 'latin1' })
      res.end(JSON.stringify(data))
    })
    closes.push(close)
    const body = 'Hola, Mundo!' // Example with Latin1 characters
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=iso-8859-1' },
      body,
    }).then(r => r.json())

    assert.ok(res.body.text === body)
  })

  it('should override content-type with contentType option', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req, { contentType: 'application/json' })
      res.end(JSON.stringify(data))
    })
    closes.push(close)
    const body = JSON.stringify({ name: 'Lete', age: 18 })
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // This should be overridden by contentType
      body,
    }).then(r => r.json())

    assert.deepStrictEqual(res.body, { name: 'Lete', age: 18 })
  })

  it('should use backContentType when no contentType is provided', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req, { contentType: 'application/json' })
      res.end(JSON.stringify(data))
    })
    closes.push(close)
    const body = JSON.stringify({ name: 'Lete', age: 18 })
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': '' }, // Empty content-type header
      body,
    }).then(r => r.json())

    assert.deepStrictEqual(res.body, { name: 'Lete', age: 18 })
  })

  it('should handle errors in body parsing using onError callback', async () => {
    const onError = (err) => {
      assert.ok(err instanceof SyntaxError)
    }
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req, { onError })
      res.end(JSON.stringify(data))
    })
    closes.push(close)
    const body = 'invalid json string'

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).then(r => r.json())

    assert.deepStrictEqual(res.body, {})
  })
})
