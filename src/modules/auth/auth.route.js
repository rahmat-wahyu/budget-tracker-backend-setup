const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const { registerValidator, loginValidator } = require('./auth.validator');
const validateRequest = require('../../middlewares/validation.middleware');

router.post('/register', 
    registerValidator,
    validateRequest,
    asyncErrorHandler(AuthController.register.bind(AuthController))
);

router.post('/login', 
    loginValidator,
    validateRequest,
    asyncErrorHandler(AuthController.login.bind(AuthController))
);

router.get('/profile', 
    asyncErrorHandler(AuthController.register.bind(AuthController))
)

module.exports = router;