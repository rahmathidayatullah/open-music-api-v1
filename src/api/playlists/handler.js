const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylists(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylists({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      messsage: 'PLaylist berhasil ditambhkan',
      data: {
        playlistId,
      },
    });
    return response.code(201);
  }

  async getPlaylistsHandler() {
    const playlists = await this._service.getPlaylists();

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistsHandler(request, h) {
    const { id: idUser } = request.auth.credentials;
    const { id: idPlaylists } = request.params;
    await this._service.verifyOwnerPlaylist(idPlaylists, idUser);
    await this._service.deletePlaylists({ idPlaylists });

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist',
    });
    return response;
  }
}

module.exports = PlaylistsHandler;
