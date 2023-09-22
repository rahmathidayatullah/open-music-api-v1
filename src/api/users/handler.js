const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
  }

  async postUsersHandler(request, h) {
    this._validator.validateUsersPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'Users berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersHandler() {
    const users = await this._service.getUsers();
    return {
      status: 'success',
      data: {
        users,
      },
    };
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async putUserByIdHandler(request) {
    this._validator.validateUsersPayload(request.payload);
    const { id } = request.params;

    await this._service.editUserById(id, request.payload);

    return {
      status: 'success',
      message: 'User berhasil diperbarui',
    };
  }

  async deleteUserByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteUserById(id);

    return {
      status: 'success',
      message: 'User berhasil dihapus',
    };
  }
}

module.exports = UsersHandler;
