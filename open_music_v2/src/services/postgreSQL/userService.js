const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const InvariantError = require('../../exceptions/invariantError')
const NotFoundError = require('../../exceptions/notFoundError')

/**
 * 
 {
    "username": string,
    "password": string,
    "fullname": string
}
 */
class UserService {
  constructor() {
    this._pool = new Pool()
  }

  // verification user with username
  async verificationUser(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    }
    const result = await this._pool.query(query)

    if (result.rows.length > 0) {
      throw new InvariantError(
        `Gagal menambahkan, username ${username} sudah digunakan`
      )
    }
  }

  async addUser({ username, password, fullname }) {
    await this.verificationUser(username)
    const id = `user-${nanoid(16)}`
    const hashedPassword = await bcrypt.hash(password, 10)
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError(`User id ${userId} tidak ditemukan`)
    }

    return result.rows[0]
  }
}

module.exports = UserService
