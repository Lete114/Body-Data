import assert from 'node:assert'
import { Buffer } from 'node:buffer'
import { afterEach, describe, it } from 'vitest'
import { bodyData } from '../src'
import { createTestServer } from './utils/createTestServer'

const closes: (() => void)[] = []

afterEach(() => {
  for (const close of closes) {
    close()
  }
})

describe('binary data handling', () => {
  it('should handle octet-stream', async () => {
    const buffer = Buffer.from([0x48, 0x65, 0x6C, 0x6C, 0x6F])
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req)
      res.end(JSON.stringify(data))
    })
    closes.push(close)

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: buffer,
    }).then(r => r.json())

    assert.ok(res.body.raw.includes('Hello'))
  })
})
