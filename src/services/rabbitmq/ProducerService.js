const { Pool } = require('pg');
const amqp = require('amqplib');

class ProducerService {
  constructor(playlistsService, playlistSongsService) {
    this._pool = new Pool();
    this._amqp = amqp;
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
  }

  async sendMessage(queue, message) {
    const connection = await this._amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  }

  async verifyOwnerPlaylist(credentialId, playlistId) {
    await this._playlistsService.verifyOwnerPlaylist(playlistId, credentialId);
    const result = await this._playlistSongsService.getSongByPlaylists({ playlistId, credentialId });

    return result;
  }
}

module.exports = ProducerService;
