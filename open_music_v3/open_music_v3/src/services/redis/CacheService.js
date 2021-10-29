const redis = require('redis')

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    })

    this._client.on('error', (error) => {
      console.error('error', error)
    })
  }

  set(key, value, expirationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (!error) {
          return resolve(ok)
        }
        return reject(error)
      })
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (reply === null) {
          return reject(new Error('Cache tidak ditemukan'))
        }
        if (!error) {
          return resolve(reply.toString())
        }
        return reject(error)
      })
    })
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (!error) {
          return resolve(count)
        }
        return reject(error)
      })
    })
  }
}

module.exports = CacheService
