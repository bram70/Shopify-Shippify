const redis = require('redis')
const { REDIS_HOST, REDIS_PORT } = process.env

function connect() {
  return redis.createClient(REDIS_PORT, REDIS_HOST)
}

module.exports = redis
module.exports.connect = connect
