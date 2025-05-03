import type { IncomingMessage } from 'node:http'
import { Buffer } from 'node:buffer'

/**
 * Get the request data content
 * @param { IncomingMessage } req Request object
 * @returns { Promise<{ params: Record<string, any>; body: Record<string, any> }> } return data
 */
export async function bodyData(req: IncomingMessage): Promise<{ params: Record<string, any>, body: Record<string, any> }> {
  return {
    params: getParams(req),
    body: await getBody(req),
  }
}

/**
 * Get get request data
 * @param { IncomingMessage } req Request object
 * @returns { Record<string,any> } return data
 */
export function getParams(req: IncomingMessage): Record<string, any> {
  // if not directly return the empty object
  if (!req.url)
    return {}

  const { searchParams } = new URL(req.url, 'http://localhost')
  return Object.fromEntries(searchParams)
}

/**
 * Get post request data
 * @param { IncomingMessage } req Request object
 * @returns { Promise<Record<string,any>> } return data
 */
export function getBody(req: IncomingMessage): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    const chunks: Uint8Array[] = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      const buffer = Buffer.concat(chunks).toString()
      const contentType = req.headers['content-type'] || ''

      if (!buffer) {
        return resolve({})
      }

      try {
        if (contentType.startsWith('application/json')) {
          return resolve(JSON.parse(buffer))
        }

        if (contentType.startsWith('application/x-www-form-urlencoded')) {
          return resolve(Object.fromEntries(new URLSearchParams(buffer)))
        }

        if (contentType.startsWith('text/plain')) {
          return resolve({ text: buffer })
        }

        if (contentType.startsWith('multipart/form-data')) {
          return resolve({ raw: buffer })
        }

        // fallback
        resolve({ raw: buffer })
      }
      catch (error) {
        console.error(`body-data "getBody" error: ${error}`)
        resolve({})
      }
    })
  })
}
