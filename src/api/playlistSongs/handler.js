const autoBind = require('auto-bind');

class PlaylistSong {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongToPlaylistsHandler(request, h) {
    this._validator.validatePlaylistSongs(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    const result = await this._service.addSongToPlaylists({
      playlistId,
      songId,
      credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        result,
      },
    });

    return response.code(201);
  }

  async getSongToPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    const result = await this._service.getSongByPlaylists({
      playlistId,
      credentialId,
    });
    const response = h.response({
      status: 'success',
      data: result,
    });
    return response;
  }

  async deleteSongToPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    this._validator.validatePlaylistSongs({ songId });

    await this._service.deleteSongInPlaylist({
      playlistId,
      songId,
      credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });

    return response;
  }
}

module.exports = PlaylistSong;
