const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  songId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
