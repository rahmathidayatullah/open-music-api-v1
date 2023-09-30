const routes = require('./routes');
const CollaborationsHandler = require('./handler');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(service, validator);
    server.route(routes(collaborationsHandler));
  },
};
