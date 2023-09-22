const routes = require('./routes');
const ActivitiesPlaylist = require('./handler');

module.exports = {
  name: 'activities_playlist',
  version: '1.0.0',
  register: async (server, { service }) => {
    const activitiesPlaylistHandler = new ActivitiesPlaylist(service);
    server.route(routes(activitiesPlaylistHandler));
  },
};
