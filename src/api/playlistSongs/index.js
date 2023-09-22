const routes = require('./routes');
const PlaylistSongs = require('./handler');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistSongs = new PlaylistSongs(service, validator);
    server.route(routes(playlistSongs));
  },
};
