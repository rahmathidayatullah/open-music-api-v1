const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesPlaylist {
  constructor(playlistsService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
  }

  async getActivitiesPlaylists({ playlistId, credentialId }) {
    await this.verifyOwnerActivities({
      idActivities: playlistId,
      userId: credentialId,
    });
    await this._playlistsService.getPlaylistById(playlistId);
  }

  async verifyOwnerActivities({ idActivities, userId }) {
    const result = await this.activitiesPlaylistById(idActivities, userId);

    return result;
  }

  async activitiesPlaylistById(idActivities, userId) {
    const query = {
      text: 'SELECT * FROM playlist_song_activities where id = $1',
      values: [idActivities],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Activities playlists tidak ditemukan');
    }
    if (result.user !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    return result.rows[0];
  }
}

module.exports = ActivitiesPlaylist;
