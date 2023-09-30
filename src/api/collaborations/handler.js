const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaboraions(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const collaborationId = await this._service.postCollaboration({ playlistId, userId, credentialId });

    const response = h.response({
      status: 'success',
      message: 'Collaborations berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaboraions(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const collaborationId = await this._service.deleteCollaboration({ playlistId, userId, credentialId });

    const response = h.response({
      status: 'success',
      message: 'Collaborations berhasil dihapus',
      data: {
        collaborationId,
      },
    });
    return response;
  }
}

module.exports = CollaborationsHandler;
