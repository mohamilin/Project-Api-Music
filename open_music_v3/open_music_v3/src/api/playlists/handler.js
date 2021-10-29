const ClientError = require('../../exceptions/clientError');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.addPlaylistHandler = this.addPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.addSongHandler = this.addSongHandler.bind(this);
    this.getSongHandler = this.getSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
    this.getUsernameHandler = this.getUsernameHandler.bind(this);
  }

  async addPlaylistHandler(req, h) {
    try {
      this._validator.validationPlaylistPayload(req.payload);
      const { name } = req.payload;
      const { id: credentialId } = req.auth.credentials;
      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId,
      });
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);
      console.log(error);
      return response;
    }
  }

  async getPlaylistHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const playlist = await this._service.getPlaylist(credentialId);
    const playlists = playlist;
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(req, h) {
    try {
      const { playlistId } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyOwnerPlaylist(playlistId, credentialId);
      await this._service.deletePlaylist(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async addSongHandler(req, h) {
    try {
      await this._validator.validationSongPayload(req.payload);
      const { playlistId } = req.params;
      const { songId } = req.payload;
      const { id: credentialId } = req.auth.credentials;
      await this._service.verifyAccessPlaylist(playlistId, credentialId);
      await this._service.postMusicToPlaylist(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu Berhasil ditambahkan',
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);
      return response;
    }
  }

  async getSongHandler(req, h) {
    try {
      const { playlistId } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyAccessPlaylist(playlistId, credentialId);

      const music = await this._service.getMusicPlaylist(playlistId);
      const songs = music;
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async deleteSongHandler(req, h) {
    try {
      const { playlistId } = req.params;
      const { songId } = req.payload;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyAccessPlaylist(playlistId, credentialId);
      await this._service.deleteMusicPlaylist(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);
      return response;
    }
  }

  async getUsernameHandler(req, h) {
    try {
      const { username = '' } = req.query;
      const users = await this._service.getUserWithUsername(username);
      return {
        status: 'success',
        data: {
          users,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistHandler;
