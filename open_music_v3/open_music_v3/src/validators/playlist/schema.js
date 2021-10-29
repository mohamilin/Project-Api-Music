const Joi = require('joi');

const playlistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const songPayloadShema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { playlistPayloadSchema, songPayloadShema };
