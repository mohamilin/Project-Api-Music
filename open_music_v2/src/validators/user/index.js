const InvariantError = require('../../exceptions/invariantError')
const { UserPayloadSchema } = require('./schema')

const userValidator = {
  validationUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = userValidator
