const ClientError = require('../../exceptions/clientError');

class UploadHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.addUploadImageHandler = this.addUploadImageHandler.bind(this)
  }

  async addUploadImageHandler(req, h) {
    try {
      const { data } = req.payload
      this._validator.validateImage(data.hapi.headers)

      const filename = await this._service.writeFile(data, data.hapi)
      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
        },
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        console.error(error);
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

module.exports = UploadHandler
