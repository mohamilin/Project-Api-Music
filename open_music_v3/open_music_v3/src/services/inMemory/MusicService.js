const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/invariantError');
const NotFoundError = require('../../exceptions/notFoundError');

class MusicService {
  constructor() {
    this._musics = [];
  }

  async addMusic({
    title, year, performer, genre, duration,
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newDataMusic = {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      insertedAt,
      updatedAt,
    };
    this._musics.push(newDataMusic);

    const isSuccess = (await this._musics.filter((item) => item.id === id).length) > 0;
    if (!isSuccess) {
      // throw new Error("Lagu tidak berhasil ditambahkan");
      throw new InvariantError('Lagu tidak berhasil ditambahkan');
    }
    return id;
  }

  async getMusic() {
    return this._musics;
  }

  async getMusicId(id) {
    const music = await this._musics.filter((item) => item.id === id)[0];
    if (!music) {
      // throw new Error(`Data music id ${id} tidak ditemukan`);
      throw new NotFoundError(`Data music id ${id} tidak ditemukan`);
    }
    return music;
  }

  async editMusic(id, {
    title, year, performer, genre, duration,
  }) {
    const index = await this._musics.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundError(`Gagal update music, id ${id} tidak ditemukan`);
    }
    // const updatedAt = await new Date().toISOString();
    this._musics[index] = {
      ...this._musics[index],
      title,
      year: Number(year),
      performer,
      genre,
      duration: Number(duration),
    };
  }

  async deleteMusic(id) {
    const index = await this._musics.findIndex((item) => item.id === id);
    if (index === -1) {
      // throw new Error(`Gagal hapus music, id ${id} tidak ditemukan`);
      throw new NotFoundError(`Gagal hapus music, id ${id} tidak ditemukan`);
    }

    this._musics.splice(index, 1);
  }
}
module.exports = MusicService;
