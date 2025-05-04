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

describe('post request with plain text', () => {
  it('should parse text/plain body', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req)
      res.end(JSON.stringify(data))
    })
    closes.push(close)

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'Just a plain text',
    }).then(r => r.json())

    assert.equal(res.body.text, 'Just a plain text')
  })
})
