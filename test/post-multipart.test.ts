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

describe('post multipart/form-data', () => {
  it('should handle multipart form data', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req)
      res.end(JSON.stringify(data))
    })
    closes.push(close)

    const form = new FormData()
    form.append('username', 'lete')
    form.append('age', '18')

    const res = await fetch(url, { method: 'POST', body: form }).then(r => r.json())
    assert.ok(res.body.raw.includes('form-data'))
    assert.ok(typeof res.body.raw === 'string')
  })
})
