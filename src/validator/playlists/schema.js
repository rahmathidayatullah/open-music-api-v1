const Joi = require('joi');

const playlistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { playlistsPayloadSchema };
