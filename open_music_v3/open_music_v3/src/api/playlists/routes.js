const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.addPlaylistHandler,
    options: {
      auth: 'open_music',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'open_music',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'open_music',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.addSongHandler,
    options: {
      auth: 'open_music',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getSongHandler,
    options: {
      auth: 'open_music',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deleteSongHandler,
    options: {
      auth: 'open_music',
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsernameHandler,
  },
];

module.exports = routes;
