import type { IncomingMessage } from 'node:http'
import type { IBodyOptions, IOptions } from './type'
import { Buffer } from 'node:buffer'

export * from './type'

/**
 * Extract both query parameters and request body data from an HTTP request.
 *
 * @param {IncomingMessage} req - The Node.js HTTP request object.
 * @param {IOptions} [options] - Optional settings for parsing the request body.
 * @returns {Promise<{ params: Record<string, any>; body: Record<string, any> }>} An object containing `params` and `body`.
 */
export async function bodyData(req: IncomingMessage, options: IOptions = {}): Promise<{ params: Record<string, any>, body: Record<string, any> }> {
  return {
    params: getParams(req),
    body: await getBody(req, options),
  }
}

/**
 * Extract query parameters from a GET or URL-based request.
 *
 * @param {IncomingMessage} req - The Node.js HTTP request object.
 * @returns {Record<string, any>} A key-value map of the URL query parameters.
 */
export function getParams(req: IncomingMessage): Record<string, any> {
  if (!req.url)
    return {}

  const { searchParams } = new URL(req.url, 'http://localhost')
  return Object.fromEntries(searchParams)
}

/**
 * Extract and parse the request body from a POST/PUT request.
 *
 * @param {IncomingMessage} req - The Node.js HTTP request object.
 * @param {IBodyOptions} [options] - Options to control body parsing behavior.
 * @returns {Promise<Record<string, any>>} Parsed body data, or raw string if `raw` is enabled or unsupported content-type.
 *
 * Supports:
 * - `application/json`
 * - `application/x-www-form-urlencoded`
 * - `text/plain`
 * - `multipart/form-data` (returns raw body string)
 */
export function getBody(req: IncomingMessage, options: IBodyOptions = {}): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    const chunks: Uint8Array[] = []
    req.on('error', (err) => {
      if (options.onError) {
        options.onError(err)
      }
      resolve({})
    })
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => {
      const encoding = options.encoding || 'utf-8'
      const buffer = Buffer.concat(chunks).toString(encoding)

      if (!buffer) {
        return resolve({})
      }

      if (options.raw) {
        return resolve({ raw: buffer })
      }

      const contentType = options.contentType || req.headers['content-type'] || options.backContentType || ''
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
      catch (err) {
        if (options.onError) {
          options.onError(err)
        }
        resolve({})
      }
    })
  })
}
