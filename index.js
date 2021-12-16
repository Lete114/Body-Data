const { get, post } = require('./lib/GetData')

/**
 * Get the request data content
 * @param {Request} req Request object
 * @returns {Object}
 */
module.exports = async (req = {}) => {
  const isObject = Object.prototype.toString.call(req) !== '[object Object]'
  const str = "'Request' Parameters do not meet the requirements"
  if (isObject) throw new Error(str)

  const method = req.method?.toUpperCase()
  if (method === 'POST') return await post(req)
  if (method === 'GET') return get(req)

  return {}
}
