/**
 * Get get request data
 * @param {Request} req Request object
 * @returns {Object}
 */
function get(req) {
  // decode
  let url = decodeURIComponent(req.url)
  // Get the content after the question mark,
  // if not directly return the empty object
  url = url.split('?')[1]
  if (!url) return {}
  url = url.split('&')

  let params = {}
  for (const key in url) {
    const temp = url[key].split('=')
    params[temp[0]] = temp[1]
  }
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
