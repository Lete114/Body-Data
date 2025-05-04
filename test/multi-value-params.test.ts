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

describe('multi-value parameters', () => {
  it('should handle array-like query params', async () => {
    const { url, close } = await createTestServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      const data = await bodyData(req)
      res.end(JSON.stringify(data))
    })
    closes.push(close)

    const res = await fetch(`${url}?tags=js&tags=ts`).then(r => r.json())
    assert.strictEqual(res.params.tags, 'ts')
  })
})
