const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.addExportMusicHandler,
    options: {
      auth: 'open_music',
    },
  },
]

module.exports = routes
