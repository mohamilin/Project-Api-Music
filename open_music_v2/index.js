require('dotenv').config()

const Hapi = require('@hapi/hapi')
const music = require('./src/api/songs')
// const MusicService = require("./src/services/inMemory/MusicService");
const MusicService = require('./src/services/postgreSQL/MusicService')

const musicValidator = require('./src/validators/music')

const init = async () => {
  const musicService = new MusicService()
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

  await server.register({
    plugin: music,
    options: {
      service: musicService,
      validator: musicValidator,
    },
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
