const ClientError = require('../../exceptions/clientError');

class CollaborationHandler {
  constructor(collabService, musicService, validator) {
    this._collabService = collabService;
    this._musicService = musicService;
    this._validator = validator;

    this.addCollaboHandler = this.addCollaboHandler.bind(this);
    this.deleteCollabHandler = this.deleteCollabHandler.bind(this);
  }

  async addCollaboHandler(req, h) {
    try {
      await this._validator.validationCollabPayload(req.payload);
      const { id: credentialId } = req.auth.crediantials;
      const { songId, userId } = req.payload;
      await this._songsService.verifyMusicOwner(songId, credentialId);
      const collaboration = await this._collabService.addCollab(songId, userId);
      const collaborationId = collaboration;
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
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
        status: 'fail',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);
      return response;
    }
  }

  async deleteCollabHandler(req, h) {
    try {
      await this._validator.validationCollabPayload(req.payload);
      const { id: credentialId } = req.auth.crediantials;
      const { songId, userId } = req.payload;

      await this._songsService.verifyMusicOwner(songId, credentialId);
      await this._collabService.deleteCollab(songId, userId);
      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
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
}

module.exports = CollaborationHandler;
