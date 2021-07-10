const { musicPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/invariantError')

const musicValidator = {
  validataionMusicPayload: (payload) => {
    const validationResult = musicPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = musicValidator
