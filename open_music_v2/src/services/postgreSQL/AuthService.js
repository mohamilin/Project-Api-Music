const { Pool } = require('pg');
const InvariantError = require('../../exceptions/invariantError');

class AuthService {
  constructor() {
    this._pool = new Pool();
  }

  async refreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyTokenRefresh(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteTokenRefresh(token) {
    await this.verifyTokenRefresh(token);

    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthService;
