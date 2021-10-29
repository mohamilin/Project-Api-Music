const ClientError = require('../../exceptions/clientError');

class ExportsHandler {
  constructor(service, validator, playlistService) {
    this._service = service
    this._validator = validator
    this._playlistService = playlistService

    this.addExportMusicHandler = this.addExportMusicHandler.bind(this)
  }

  async addExportMusicHandler(req, h) {
    try {
      await this._validator.validateExportMusicPayload(req.payload)
      const { playlistId } = req.params
      const { id: userId } = req.auth.credentials
      await this._playlistService.verifyAccessPlaylist(playlistId, userId)
      const message = {
        playlistId,
        targetEmail: req.payload.targetEmail,
      }

      await this._service.sendMessage('export:songs', JSON.stringify(message))
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      })

      response.code(201)
      return response
    } catch (error) {
      console.error('pesan error handler', error)
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
}

module.exports = ExportsHandler
