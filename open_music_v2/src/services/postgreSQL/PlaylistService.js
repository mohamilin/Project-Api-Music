const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/invariantError');
const NotFoundError = require('../../exceptions/notFoundError');
const AuthorizationError = require('../../exceptions/authorizationError');

class PlaylistService {
  constructor(CollaborationsService) {
    this._pool = new Pool();
    this._collaborationService = CollaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylist(users) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
            LEFT JOIN users ON users.id = playlists.owner
            LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1;`,
      values: [users],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus, Id tidak ditemukan');
    }
  }

  async postMusicToPlaylist(playlistId, songId) {
    const query = {
      text: 'INSERT INTO playlistsongs (playlist_id, song_id) VALUES($1, $2) RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  // Get music form playlist
  async getMusicPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer 
      FROM songs JOIN playlistsongs ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  // Delete music form playlist
  async deleteMusicPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }

  async getUserWithUsername(username) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username LIKE $1',
      values: [`${username}`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyOwnerPlaylist(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini.');
    }
  }

  async verifyAccessPlaylist(playlistId, userId) {
    try {
      await this.verifyOwnerPlaylist(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
