const Joi = require('joi');

const collaboraionsPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { collaboraionsPayloadSchema };
