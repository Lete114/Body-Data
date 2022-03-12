/**
 * Get get request data
 * @param {Request} req Request object
 * @returns {Object}
 */
function get(req) {
  const params = {}
  // if not directly return the empty object
  if (!req.url) return params

  const url = new URL(req.url, `http://${req.headers.host}/`)

  // Iterate through all the entries and assemble the parameters
  for (const [key, value] of url.searchParams) params[key] = value

  return params
}

/**
 * Get post request data
 * @param {Request} req Request object
 * @returns {Object}
 */
function post(req) {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      if (!data) return resolve({})
      resolve(JSON.parse(data))
    })
  })
}

module.exports = { get, post }
