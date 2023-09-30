const InvariantError = require('../../exceptions/InvariantError');
const { collaboraionsPayloadSchema } = require('./schema');

const CollaboraionsValidator = {
  validateCollaboraions: (payload) => {
    const validationResult = collaboraionsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaboraionsValidator;
