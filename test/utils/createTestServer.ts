import http from 'node:http'

export function createTestServer(
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
): Promise<{ url: string, close: () => void }> {
  return new Promise((resolve) => {
    const server = http.createServer(handler)
    server.listen(0, () => {
      const address = server.address()
      if (address && typeof address === 'object') {
        const url = `http://127.0.0.1:${address.port}`
        resolve({
          url,
          close: () => server.close(),
        })
      }
    })
  })
}
