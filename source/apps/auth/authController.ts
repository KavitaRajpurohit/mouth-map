import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import authServices from '../auth/authServices';
import Messages from '../../common/utils/messages/english';
import English from '../../common/utils/messages/english';
import Spanish from '../../common/utils/messages/spanish'
import emailService from '../../common/services/emailService';
//import smsService from '../../common/services/smsService';
import tokenService from '../../common/services/tokenService';
import AppError from '../../common/utils/appError';
import bcrypt from 'bcryptjs';
import Tokens from '../../model/tokenModel';
import auth from '../../common/middlewares/auth';
import mongoose from 'mongoose';
import constant from '../../common/config/constant';



const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const user: any = await authServices.register(req.body);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.CREATE_ACCOUNT, user);
        }
        else {
            createResponse(res, httpStatus.OK, English.CREATE_ACCOUNT, user);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        // let { sEmail, sPassword, sUserRole } = req.body;
        const user: any = await authServices.login(req.body);

        const tokens = await tokenService.generateAuthTokens(user._id, user.sUserRole);
        const response = { user: user.transform(), tokens };
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.LOGIN, response);
        }
        else {
            createResponse(res, httpStatus.OK, English.LOGIN, response);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {})
    }
};

// const forgotpassword = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const language = req.header('language');

//         let { sEmail, sUserRole } = req.body;
//         const Data: any = await authServices.checkEmail(sEmail, sUserRole);
//         await Tokens.deleteOne({ user: new mongoose.Types.ObjectId(Data._id), type: constant.TOKEN_TYPE.RESET_PASSWORD })
//         const tokens = await tokenService.generateResetPasswordToken(Data);
//         await emailService.sendForgotPasswordEmail(sEmail, Data, tokens)
//         if (language == 'Spanish') {
//             createResponse(res, httpStatus.OK, Spanish.FORGOT_PASSWORD.replace('$', Data.sEmail), {});
//         }
//         else {

//             createResponse(res, httpStatus.OK, English.FORGOT_PASSWORD.replace('$', Data.sEmail), {});
//         }
//     } catch (error: any) {
//         console.log(error);
//         createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
//     }
// };
const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');
        const loginWithEmailOtp: any = await authServices.forgetPassword(req.body);
        const tokens = await tokenService.generateResetPasswordToken(loginWithEmailOtp);

        const response = { user: loginWithEmailOtp, tokens };
        await emailService.sendForgotPasswordEmail(loginWithEmailOtp.sEmail, loginWithEmailOtp, tokens);

        console.log(loginWithEmailOtp.sEmail, loginWithEmailOtp, tokens, '------------');

        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.FORGOT_PASSWORD, response);
        }
        else {
            createResponse(res, httpStatus.OK, English.FORGOT_PASSWORD, response);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.CONFLICT, error.message, {});
    }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const language = req.header('language');
    try {

        let { sPassword } = req.body;
        let { token } = req.params;

        sPassword = await bcrypt.hash(sPassword, 8);

        let userData = await authServices.resetPassword(token, sPassword);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.RESET_PASSWORD, userData);
        }
        else {

            createResponse(res, httpStatus.OK, English.RESET_PASSWORD, userData);
        }
    } catch (error: any) {
        if (error.message === "jwt expired") {
            error.message = "Your reset password link expired."
        }

        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const sendVerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const language = req.header('language');
    try {
        let { sEmail, sUserRole } = req.body;
        const user: any = await authServices.checkVerifyEmail(sEmail, sUserRole);
        const tokens = await tokenService.generateVerifyPasswordToken(user);
        await emailService.sendVerifyUserEmail(sEmail, user, tokens)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.VERIFY_SUCCESS, user);
        }
        else {

            createResponse(res, httpStatus.OK, English.VERIFY_SUCCESS, user);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const checkLink = async (req: Request, res: Response, next: NextFunction) => {
    const language = req.header('language');
    try {
        let { token } = req.params;
        let userData = await authServices.checkLinkToken(token);
        createResponse(res, httpStatus.OK, Messages.VERIFY_ACCOUNT, userData);
    } catch (error: any) {
        if (error.message === "jwt expired") {
            error.message = "Your reset password link expired."
        }

        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const checkResetLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { token } = req.params;
        let userData = await authServices.checkResetLinkToken(token);
        createResponse(res, httpStatus.OK, Messages.VERIFY_ACCOUNT, userData);
    } catch (error: any) {
        if (error.message === "jwt expired") {
            error.message = "Your reset password link expired."
        }
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const refreshTokens = async (req: Request, res: Response) => {
    try {
        const language = req.header('language');

        const tokens = await authServices.refreshAuthTokens(req.body.refreshToken);
        const response = { ...tokens };
        console.log(response, 'response-----------');

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.REFRESH_TOKEN, {
                tokens: response,
            });
        }
        else {

            createResponse(res, httpStatus.OK, English.REFRESH_TOKEN, {
                tokens: response,
            });
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};


const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        let { user }: any = req.user;
        await authServices.logout(user);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.LOGOUT, {});
        }
        else {
            createResponse(res, httpStatus.OK, English.LOGOUT, {});
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');
        const verifyOtp: any = await authServices.verifyOTP(req.body);
        console.log(req.body, 'req.body------');

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.otpBody, verifyOtp);
        }
        else {
            createResponse(res, httpStatus.OK, English.otpBody, verifyOtp);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.CONFLICT, error.message, {});
    }
};
const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');
        const resendOtp: any = await authServices.resendOTP(req.body);
        console.log(req.body, 'req.body-------');

        if (resendOtp) {
            await emailService.sendOtp(resendOtp.sEmail, resendOtp, 'Resend OTP');

            if (language == 'Spanish') {

                createResponse(res, httpStatus.OK, Spanish.otpSend, {});
            }
            else {
                createResponse(res, httpStatus.OK, English.otpSend, {});
            }
        }
    } catch (error: any) {
        createResponse(res, httpStatus.CONFLICT, error.message, {});
    }
};

export default {
    register,
    login,
    //forgotpassword,
    forgetPassword,
    resetPassword,
    checkLink,
    checkResetLink,
    refreshTokens,
    logout,
    sendVerifyEmail,
    verifyOTP,
    resendOTP
}