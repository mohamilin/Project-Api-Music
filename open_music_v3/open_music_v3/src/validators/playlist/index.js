const { playlistPayloadSchema, songPayloadShema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const playlistValidator = {
  validationPlaylistPayload: (payload) => {
    const validationResult = playlistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validationSongPayload: (payload) => {
    const validationResult = songPayloadShema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistValidator;
