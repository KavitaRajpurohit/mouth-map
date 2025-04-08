import express from 'express';
import validate from '../../common/middlewares/validate';
import auth from '../../common/middlewares/auth'
import authValidation from './authValidation';
import authController from './authController';
import languageUsed from '../../common/middlewares/languageGet';

const router = express.Router();

router.post('/register', languageUsed, validate(authValidation.register), authController.register);
router.post('/login', languageUsed, validate(authValidation.login), authController.login);

//router.post('/adminLogin', languageUsed, validate(authValidation.login), authController.login);
//router.post('/forgotpassword', languageUsed, validate(authValidation.forgotPassword), authController.forgotpassword);
router.post('/forgetPassword', languageUsed, validate(authValidation.forgetPassword), authController.forgetPassword);

router.post('/sendVerifyEmail', validate(authValidation.forgotPassword), authController.sendVerifyEmail);

router.post('/resetPassword/:token', languageUsed, validate(authValidation.resetPassword), authController.resetPassword);
router.post('/checkLink/:token', authController.checkLink);
router.post('/checkResetLink/:token', authController.checkResetLink);

router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

router.delete('/logout', auth, languageUsed, authController.logout);

router.post('/verifyOTP', languageUsed, validate(authValidation.verifyOTP), authController.verifyOTP);
router.post('/resendOTP', languageUsed, validate(authValidation.resendOTP), authController.resendOTP);


export = router