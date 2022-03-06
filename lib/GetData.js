/**
 * Get get request data
 * @param {Request} req Request object
 * @returns {Object}
 */
function get({ url }) {
  const params = {}
  // if not directly return the empty object
  if (!url) return params

  // Get the content after the question mark
  const index = url.indexOf('?') + 1
  const string = url.substring(index)

  // Parsing the query string , Return all entries
  const query = new URLSearchParams(string).entries()

  // Iterate through all the entries and assemble the parameters
  for (const i of query) params[i[0]] = i[1]

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
