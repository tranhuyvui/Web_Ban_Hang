const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware')
const otpController = require('../controllers/otpController');
const hashPassword = require('../middlewares/hashPassword');
const { validatorLogin, validatorRegister } = require('../middlewares/validatorLogin_Register');
const handleValidation = require('../middlewares/handleValidation');

authRouter.post('/refresh', authController.refreshToken);

authRouter.post('/login', validatorLogin, handleValidation, authController.login, authenticateToken);
authRouter.get('/logout', authController.logOut);
authRouter.post('/register', validatorRegister, handleValidation, hashPassword, authController.register);
authRouter.post('/register/verify', authController.verifyRegister);

authRouter.post('/forgot-password', otpController.sendOtpForgotController); 
authRouter.post('/forgot-password/verify', otpController.verifyOtpController);

authRouter.post('/reset-password', hashPassword, authController.resetPassword);

module.exports = authRouter;
