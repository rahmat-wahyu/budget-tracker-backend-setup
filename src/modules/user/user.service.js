const { User } = require('../../../models');
const bcrypt = require('bcrypt');

class UserService {
    constructor() {
        this.SALT_ROUNDS = 10;
    }

    async getAll() {
        return await User.findAll({ attributes: { exclude: ['password']} });
    }
}

module.exports = new UserService();