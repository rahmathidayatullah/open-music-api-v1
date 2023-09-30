const fs = require('fs');
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapAlbumsDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumsService {
  constructor(folder, cacheService) {
    this._pool = new Pool();
    this._folder = folder;
    this._cacheService = cacheService;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Albums gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return mapAlbumsDBToModel(result.rows[0]);
  }

  async getSongByAlbumId(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE "albumId" = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows.map(mapAlbumsDBToModel);
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapAlbumsDBToModel);
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui albums. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Albums gagal dihapus. Id tidak ditemukan');
    }
  }

  async addCoverAlbum(playlistId, urlAlbum) {
    await this.getAlbumById(playlistId);
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1',
      values: [urlAlbum],
    };
    await this._pool.query(query);
  }

  async postAlbumLike({ albumId, credentialId }) {
    await this.getAlbumById(albumId);
    await this.getAlbumLikeById(credentialId, albumId);
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2)',
      values: [credentialId, albumId],
    };
    await this._cacheService.delete(`albumsDetail:${albumId}`);
    await this._cacheService.delete(`albumsCount:${albumId}`);
    await this._pool.query(query);
  }

  async getAlbumLikeById(credentialId, albumId) {
    try {
      // mendapatkan dari cache
      const resultRedis = await this._cacheService.get(`albumsDetail:${albumId}`);
      if (resultRedis.rows.length && resultRedis.rows[0].user_id === credentialId) {
        throw new ClientError(
          'Album sudah di like',
        );
      }
      return JSON.parse(resultRedis);
    } catch (error) {
      // akan disimpan pada cache sebelum dikembalikan
      const query = {
        text: 'SELECT user_id from user_album_likes WHERE user_id = $1',
        values: [credentialId],
      };
      const result = await this._pool.query(query);
      if (result.rows.length && result.rows[0].user_id === credentialId) {
        throw new ClientError(
          'Album sudah di like',
        );
      }
      await this._cacheService.set(`albumsDetail:${albumId}`, JSON.stringify(result));
      return result;
    }
  }

  async deleteAlbumLike({ albumId, credentialId }) {
    await this.getAlbumById(albumId);
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1',
      values: [credentialId],
    };
    await this._cacheService.delete(`albumsDetail:${albumId}`);
    await this._cacheService.delete(`albumsCount:${albumId}`);
    await this._pool.query(query);
  }

  async getAlbumLike({ albumId }) {
    try {
      // mendapatkan dari cache
      const resultRedis = await this._cacheService.get(`albumsCount:${albumId}`);
      const parseResult = JSON.parse(resultRedis);

      return { count: parseResult, cache: true };
    } catch (error) {
      const query = {
        text: 'SELECT album_id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`albumsCount:${albumId}`, JSON.stringify(result.rowCount));
      return { count: result.rowCount, cache: false };
    }
  }
}

module.exports = AlbumsService;
