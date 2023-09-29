/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesPlaylist {
  constructor(playlistsService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
  }

  async getActivitiesPlaylists({ playlistId, credentialId }) {
    // const userId = await this.checkExistActivityByPlaylistId(playlistId);
    await this._playlistsService.getPlaylistById(playlistId);
    const result = await this.verifyOwnerActivities({
      idActivities: playlistId,
      userId: credentialId,
    });
    const resultMap = result.map((items, index) => ({
      [`activity${index + 1}`]: items,
    }));
    return resultMap;
  }

  async verifyOwnerActivities({ idActivities, userId }) {
    const result = await this.activitiesPlaylistById(idActivities, userId);
    return result;
  }

  async activitiesPlaylistById(idActivities, userId) {
    const query = {
      text: 'SELECT u.username, p.name, a.action, a.time, a.user_id FROM playlist_song_activities a join playlists p on a.playlist_id = p.id join users u on p.owner = u.id  where a.playlist_id = $1',
      values: [idActivities],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Activities playlists tidak ditemukan');
    }
    if (result.rows[0].user_id !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }

    const resultMap = result.rows.map((items) => ({
      username: items.username,
      title: items.name,
      action: items.action,
      time: items.time,
    }));

    return resultMap;
  }

  async checkExistActivityByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT * FROM playlist_song_activities where playlist_id = $1 RETURNING user_id',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Activities playlists tidak ditemukan');
    }
    return result;
  }

  async addActivityPlaylistSongs(playlistId, songId, credentialId, action) {
    await this._playlistsService.getPlaylistById(playlistId);
    const idPlaylistSongActivity = `playlist_songs_activity-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5)',
      values: [idPlaylistSongActivity, playlistId, songId, credentialId, action],
    };
    const result = this._pool.query(query);
    return result;
  }

  async deletePlaylistSongActivities(idPlaylists) {
    const query = {
      text: 'DELETE FROM playlist_song_activities where playlist_id = $1',
      values: [idPlaylists],
    };

    await this._pool.query(query);
  }
}

module.exports = ActivitiesPlaylist;
