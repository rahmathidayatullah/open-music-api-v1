const InvariantError = require('../../exceptions/InvariantError');
const { playlistsPayloadSchema } = require('./schema');

const PlaylistsValidator = {
  validatePlaylists: (payload) => {
    const validationResult = playlistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
