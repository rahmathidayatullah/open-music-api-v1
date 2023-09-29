const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(playlistsService, songsService, activitiesPlaylistService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._activitiesPlaylistService = activitiesPlaylistService;
  }

  async addSongToPlaylists({ playlistId, songId, credentialId }) {
    await this._playlistsService.verifyOwnerPlaylist(playlistId, credentialId);
    await this._activitiesPlaylistService.addActivityPlaylistSongs(playlistId, songId, credentialId, 'add');

    const idPlaylistSong = `playlist_songs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [idPlaylistSong, playlistId, songId],
    };
    await this._songsService.verifySongs(songId);
    const resultPlaylistSong = await this._pool.query(query);

    if (!resultPlaylistSong.rows[0].id) {
      throw new InvariantError('Playlists gagal ditambahkan');
    }

    return resultPlaylistSong.rows[0].id;
  }

  async getSongByPlaylists({ playlistId, credentialId }) {
    await this._playlistsService.verifyOwnerPlaylist(playlistId, credentialId);

    const query = {
      text: 'SELECT id,title,performer FROM songs WHERE id IN (SELECT song_id FROM playlist_songs WHERE playlist_id = $1)',
      values: [playlistId],
    };

    const resultSongs = await this._pool.query(query);
    if (!resultSongs.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    const queryPlaylist = {
      text: 'SELECT p.id, p.name, u.username FROM playlists p JOIN users u ON p.owner = u.id WHERE p.id = $1',
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);

    const data = {
      playlist: { ...resultPlaylist.rows[0], songs: resultSongs.rows },
    };

    return data;
  }

  async deleteSongInPlaylist({ playlistId, songId, credentialId }) {
    await this._playlistsService.verifyOwnerPlaylist(playlistId, credentialId);
    await this._activitiesPlaylistService.addActivityPlaylistSongs(playlistId, songId, credentialId, 'delete');

    const query = {
      text: 'DELETE from playlist_songs WHERE song_id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    return result;
  }
}

module.exports = PlaylistSongsService;
