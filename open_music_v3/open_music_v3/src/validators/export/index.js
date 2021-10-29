const ExportMusicPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/invariantError')

const ExportValidator = {
  validateExportMusicPayload: (payload) => {
    const validationResult = ExportMusicPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = ExportValidator
