require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path')
const Inert = require('@hapi/inert')

const music = require('./src/api/music');
// const MusicService = require("./src/services/inMemory/MusicService");
const MusicService = require('./src/services/postgreSQL/MusicService');
const musicValidator = require('./src/validators/music');

/**
 * for user
 */

const user = require('./src/api/users');
const UserService = require('./src/services/postgreSQL/UserService');
const userValidator = require('./src/validators/user');

/**
 * for Authentication
 */

const authenticate = require('./src/api/authenticate');
const AuthService = require('./src/services/postgreSQL/AuthService');
const TokenManager = require('./src/token/tokenManager');
const AuthenticationsValidator = require('./src/validators/auth');

/**
 * for Playlist
 */

const playlist = require('./src/api/playlists');
const PlaylistService = require('./src/services/postgreSQL/PlaylistService');
const playlistValidator = require('./src/validators/playlist');

/**
 * for collaborations
 */
const collaboration = require('./src/api/collaboration');
const CollaborationService = require('./src/services/postgreSQL/CollaborationService');
const collaborationValidator = require('./src/validators/collab');

/**
 * Exports
 */
const _export = require('./src/api/exports')
const ProducerService = require('./src/services/rabbitmq/ProducerService')
const exportValidator = require('./src/validators/export')

/**
 * Cache Redis
 */
const CacheService = require('./src/services/redis/CacheService')

/**
 * Upload
 */

const upload = require('./src/api/uploads')
const StorageServices = require('./src/services/storage/StorageService');
const uploadValidator = require('./src/validators/upload');

const init = async () => {
  // cache
  const cacheService = new CacheService()
  const musicService = new MusicService();
  const userService = new UserService();
  const collabService = new CollaborationService(cacheService);
  const playlistService = new PlaylistService(collabService, cacheService);
  const authenticationsService = new AuthService();
  const storageService = new StorageServices(path.resolve(__dirname, 'src/api/uploads/file/images'))
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
  });

  /**
   * registrasi plugin eksternal
   */
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  /**
   * Definition for authentication jwt
   */

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('open_music', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  /**
   * registrasi plugin internal
   */
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
    {
      plugin: authenticate,
      options: {
        // authService: authenticationsService,
        // service: userService,
        authenticationsService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: playlistValidator,
      },
    },
    {
      plugin: collaboration,
      options: {
        collabService,
        musicService,
        validator: collaborationValidator,
      },
    },
    {
      plugin: _export,
      options: {
        service: ProducerService,
        validator: exportValidator,
        playlistService,
      },
    },
    {
      plugin: upload,
      options: {
        service: storageService,
        validator: uploadValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
