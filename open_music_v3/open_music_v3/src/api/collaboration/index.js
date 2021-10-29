const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collabService, musicService, validator }) => {
    const collaborationHandler = new CollaborationHandler(collabService, musicService, validator);
    server.route(routes(collaborationHandler));
  },
};
