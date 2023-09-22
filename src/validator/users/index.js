const InvariantError = require('../../exceptions/InvariantError');
const { usersPayloadSchema } = require('./schema');

const SongsValidator = {
  validateUsersPayload: (payload) => {
    const validationResult = usersPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
