const NotFound = require('../../errors/NotFoundError');
const UserService = require('./user.service');

class UserController {
    async getAll(req, res, next){
        try {
            const users = await UserService.getAll();
            if(users.length === 0) throw new NotFound("Data Users Belum ada boy!")
            res.json({
                success: true, 
                message: "User Berhasil Di dapat!", 
                data: users
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new UserController();