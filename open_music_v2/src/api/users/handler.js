const ClientError = require('../../exceptions/clientError');

class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validataor = validator;

    this.addUserHandler = this.addUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async addUserHandler(req, h) {
    try {
      await this._validataor.validationUserPayload(req.payload);
      const { username, password, fullname } = req.payload;
      const userId = await this._service.addUser({
        username,
        password,
        fullname,
      });
      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
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
      console.error('error di 47', error.message);
      return response;
    }
  }

  async getUserByIdHandler(req, h) {
    try {
      const { userId } = req.params;
      const user = await this._service.getUserByIdHandler(userId);
      const response = h.response({
        status: 'success',
        data: {
          user,
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

      // server ERROR!
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

module.exports = UserHandler;
