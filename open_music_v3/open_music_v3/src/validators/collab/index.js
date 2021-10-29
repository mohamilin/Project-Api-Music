const { CollaborationPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const collabValidation = {
  validationCollabPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = collabValidation;
