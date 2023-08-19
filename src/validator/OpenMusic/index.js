const InvariantError = require('../../exceptions/InvariantError');
const { albumsPayloadSchema, songsPayloadSchema } = require('./schema');

const OpenMusicValidator = {
  validateAlbumsPayload: (payload) => {
    const validationResult = albumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongsPayload: (payload) => {
    const validationResult = songsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = OpenMusicValidator;
