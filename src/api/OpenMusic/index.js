const routes = require('./routes');
const OpenMusicHandler = require('./handler');

module.exports = {
  name: 'open-music',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const openMusicHandler = new OpenMusicHandler(service, validator);
    server.route(routes(openMusicHandler));
  },
};
