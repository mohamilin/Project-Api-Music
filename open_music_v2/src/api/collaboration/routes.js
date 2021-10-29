const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.addCollaboHandler,
    options: {
      auth: 'open_music',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollabHandler,
    options: {
      auth: 'open_music',
    },
  },
];

module.exports = routes;
