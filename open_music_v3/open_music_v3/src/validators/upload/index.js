const InvariantError = require('../../exceptions/invariantError');
const { ImageSchema } = require('./schema');

const uploadValidator = {
  validateImage: (headers) => {
    const validationResult = ImageSchema.validate(headers)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = uploadValidator
