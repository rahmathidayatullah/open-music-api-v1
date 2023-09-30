const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapPLaylists } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylists({ name, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlists gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists() {
    const query = {
      text: 'SELECT * FROM playlists p join users u on p.owner = u.id',
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapPLaylists);
  }

  async deletePlaylists({ idPlaylists, idUser }) {
    await this.verifyOwnerPlaylistIntern(idPlaylists, idUser);
    const query = {
      text: 'DELETE FROM playlists where id = $1',
      values: [idPlaylists],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyOwnerPlaylistIntern(playlistId, credentialId) {
    const resultPlaylist = await this.getPlaylistByIdIntern(playlistId);

    const playlists = resultPlaylist;

    if (playlists.owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini ');
    }
    return playlists;
  }

  async getPlaylistByIdIntern(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }

    return result.rows[0];
  }

  async deletePlaylistSongActivities(idPlaylists) {
    const query = {
      text: 'DELETE FROM playlist_song_activities where playlist_id = $1',
      values: [idPlaylists],
    };

    await this._pool.query(query);
  }

  async verifyOwnerPlaylist(playlistId, credentialId) {
    const resultPlaylist = await this.getPlaylistById(playlistId, credentialId);

    const playlists = resultPlaylist;

    if (playlists.owner !== credentialId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
    return playlists;
  }

  async getPlaylistById(playlistId, credentialId) {
    const queryCollaboration = {
      text: 'SELECT user_id from collaborations where user_id = $1',
      values: [credentialId],
    };
    const resultQueryCollaborations = await this._pool.query(queryCollaboration);

    if (resultQueryCollaborations.rows.length) {
      return resultQueryCollaborations.rows.map((items) => ({
        owner: items.user_id,
      }))[0];
    }

    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan yes');
    }

    return result.rows[0];
  }
}

module.exports = PlaylistsService;
