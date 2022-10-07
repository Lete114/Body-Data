const { get, post } = require('./lib/GetData')

/**
 * Get the request data content
 * @param {IncomingMessage} req Request object
 * @returns {Object}
 */
module.exports = async (req = {}) => {
  const isObject = Object.prototype.toString.call(req) !== '[object Object]'
  const str = "'Request' Parameters do not meet the requirements"
  if (isObject) throw new Error(str)

  const method = req.method ? req.method.toUpperCase() : void 0
  if (method === 'POST') return await post(req)
  if (method === 'GET') return get(req)

  return {}
}
