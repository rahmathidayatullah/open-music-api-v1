const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumsHandler(request, h) {
    this._validator.AlbumsValidator.validateAlbumsPayload(request.payload);
    const { name = 'untitled', year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Albums berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songsByIdAlbum = await this._service.getSongByAlbumId(id);
    return {
      status: 'success',
      data: {
        album: { ...album, songs: songsByIdAlbum },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.AlbumsValidator.validateAlbumsPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._validator.UploadsValidator.validateImageHeaders(cover.hapi.headers);
    const { id } = request.params;
    const filename = await this._service.writeFile(cover, cover.hapi);
    const urlAlbum = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;
    await this._service.addCoverAlbum(id, urlAlbum);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: urlAlbum,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
