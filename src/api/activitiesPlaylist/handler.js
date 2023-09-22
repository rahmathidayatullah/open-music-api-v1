const autoBind = require('auto-bind');

class ActivitiesPlaylistHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async getActivitiesPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const activitiesPlaylist = await this._service.getActivitiesPlaylists({
      playlistId,
      credentialId,
    });

    console.log('activitiesPlaylist', activitiesPlaylist);

    const response = h.response({
      status: 'success',
      data: {
        playlistId: '',
        activities: [
          {
            activity1: {
              username: '',
              title: '',
              action: '',
              time: '',
            },
            activity2: {
              username: '',
              title: '',
              action: '',
              time: '',
            },
            activity3: {
              username: '',
              title: '',
              action: '',
              time: '',
            },
          },
        ],
      },
    });
    return response;
  }
}
module.exports = ActivitiesPlaylistHandler;