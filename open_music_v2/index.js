require('dotenv').config()

const Hapi = require('@hapi/hapi')

/**
 * for song
 */
const music = require('./src/api/songs')
// const MusicService = require("./src/services/inMemory/MusicService");
const MusicService = require('./src/services/postgreSQL/musicService')
const musicValidator = require('./src/validators/music')

/**
 * for user
 */

const user = require('./src/api/users')
const UserService = require('./src/services/postgreSQL/userService')
const userValidator = require('./src/validators/user')

const init = async () => {
  const musicService = new MusicService()
  const userService = new UserService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    // port: process.env.PORT,
    // host: process.env.NODE_ENV !== "production" ? process.env.HOST : "0.0.0.0",
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  })

  await server.register([
    {
      plugin: music,
      options: {
        service: musicService,
        validator: musicValidator,
      },
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: userValidator,
      },
    },
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
