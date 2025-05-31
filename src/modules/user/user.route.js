const express = require('express');
const router = express.Router();

const UserController = require('./user.controller');

const asyncErrorHandler = require('../../errors/asyncErrorHandler');

router.get('/', asyncErrorHandler(
    UserController.getAll.bind(UserController)
));

router.get('/:id', asyncErrorHandler(
    UserController.getById.bind(UserController)
));

router.post('/', asyncErrorHandler(
    UserController.create.bind(UserController)
));

router.put('/:id', asyncErrorHandler(
    UserController.update.bind(UserController)
));

router.delete('/:id', asyncErrorHandler(
    UserController.delete.bind(UserController)
));

module.exports = router;