/**
 * Get get request data
 * @param {IncomingMessage} req Request object
 * @returns {Object}
 */
function get(req) {
  // if not directly return the empty object
  if (!req.url) return {}

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`)

  return Object.fromEntries(searchParams)
}

/**
 * Get post request data
 * @param {IncomingMessage} req Request object
 * @returns {Object}
 */
function post(req) {
  return new Promise((resolve) => {
    let data = []
    req.on('data', (chunk) => {
      data.push(chunk)
    })
    req.on('end', () => {
      data = Buffer.concat(data).toString()
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        resolve({})
      }
    })
  })
}

module.exports = { get, post }
