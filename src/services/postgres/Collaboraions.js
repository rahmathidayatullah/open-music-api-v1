const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationService {
  constructor() {
    this._pool = new Pool();
  }

  async postCollaboration({ playlistId, userId, credentialId }) {
    await this.verifyUserExist({ userId });
    await this.verifyPlaylistExist({ playlistId });
    await this.verifyOwner({ credentialId });
    const id = `colaborations-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Collaborations gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId, credentialId }) {
    await this.verifyUserExist({ userId });
    await this.verifyPlaylistExist({ playlistId });
    await this.verifyOwner({ credentialId });

    const query = {
      text: 'DELETE FROM collaborations WHERE user_id = $1 RETURNING id',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Collaboration gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyUserExist({ userId }) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Users tidak ditemukan');
    }
    return result;
  }

  async verifyPlaylistExist({ playlistId }) {
    const query = {
      text: 'SELECT id FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    return result;
  }

  async verifyOwner({ credentialId }) {
    console.log('credentialId', credentialId);
    const query = {
      text: 'SELECT owner FROM playlists WHERE owner = $1',
      values: [credentialId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    return result;
  }
}

module.exports = CollaborationService;
