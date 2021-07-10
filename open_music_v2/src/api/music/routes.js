const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.addMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getMusicHandler,
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getMusicIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.editMusicHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteMusicHandler,
  },
]

module.exports = routes
