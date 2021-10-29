require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

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

const init = async () => {
  const musicService = new MusicService();
  const userService = new UserService();
  const authenticationsService = new AuthService();
  const playlistService = new PlaylistService();
  const collabService = new CollaborationService();
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
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
