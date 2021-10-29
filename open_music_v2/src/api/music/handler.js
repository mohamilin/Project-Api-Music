const ClientError = require('../../exceptions/clientError');

class MusicHandler {
  // constructor(service) {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addMusicHandler = this.addMusicHandler.bind(this);
    this.getMusicHandler = this.getMusicHandler.bind(this);
    this.getMusicIdHandler = this.getMusicIdHandler.bind(this);
    this.editMusicHandler = this.editMusicHandler.bind(this);
    this.deleteMusicHandler = this.deleteMusicHandler.bind(this);
  }

  async addMusicHandler(req, h) {
    try {
      this._validator.validataionMusicPayload(req.payload);
      const {
        title = 'untitled',
        year,
        performer,
        genre,
        duration,
      } = req.payload;
      const songId = await this._service.addMusic({
        title,
        year,
        performer,
        genre,
        duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: { songId },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getMusicHandler() {
    const songs = await this._service.getMusic();
    return {
      status: 'success',
      data: {
        songs: songs.map((item) => ({
          id: item.id,
          title: item.title,
          performer: item.performer,
        })),
      },
    };
  }

  async getMusicIdHandler(req, h) {
    try {
      const { songId } = req.params;
      const song = await this._service.getMusicId(songId);

      return {
        status: 'success',
        data: {
          // song,
          song: {
            id: song.id,
            title: song.title,
            year: song.year,
            performer: song.performer,
            genre: song.genre,
            duration: Number(song.duration),
            insertedAt: song.insertedAt,
            updatedAt: song.updatedAt,
          },
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
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async editMusicHandler(req, h) {
    try {
      this._validator.validataionMusicPayload(req.payload);
      const { songId } = req.params;
      await this._service.editMusic(songId, req.payload);
      return {
        status: 'success',
        message: 'lagu berhasil diperbaru',
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

  async deleteMusicHandler(req, h) {
    try {
      const { songId } = req.params;
      await this._service.deleteMusic(songId);
      return {
        status: 'success',
        message: 'lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);
        return response;
      }

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

module.exports = MusicHandler;
