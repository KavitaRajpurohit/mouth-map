import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import Products from '../../model/productModel';
import categories from '../../model/categoryModel';
import Promocode from '../../model/promocodeModel'
import deviceToken from '../../model/deviceTokenModel';
import brands from '../../model/brandModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import constant from '../../common/config/constant';
import Tokens from '../../model/tokenModel';
import tokenService from '../../common/services/tokenService';
import otpService from '../../common/services/otpService';
import mongoose from 'mongoose';

const register = async (body: any) => {
    let str = body.sEmail;
    body.sEmail = str.toLowerCase()

    body.sPassword = await bcrypt.hash(body.sPassword, 8);
    // let lower = body;
    // body = lower.toLowerCase()
    let user: any
    if (user) {

        throw new AppError(httpStatus.CREATED, messages.ALREADY_EXITS);
    }
    user = await new userModel(body).save();
    return user
};
const adminlogin = async (email: String, password: String) => {
    console.log(email, 'email');

    //     let lower = email;
    //     email = lower.toLowerCase()

    //email = lower.toLowerCase()
    let user = await userModel.findOne({ sEmail: email, sUserRole: "Admin" })

    if (user) {
        await checkPassword(password, user.sPassword);
        return user
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.INCORRENT);
    }
};

// const checkPassword = async (password: any, correctPassword: any) => {
//     const isPasswordMatch = await bcrypt.compare(password, correctPassword);
//     if (!isPasswordMatch) {
//         throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.INCORRENT);
//     }
// };

// const checkPassword = async (password: any, correctPassword: any) => {
//     const isPasswordMatch = await bcrypt.compare(password, correctPassword);
//     if (!isPasswordMatch) {
//         throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.inValid);
//     }
// };

const checkActive = async (sEmail: String, sUserRole: any) => {
    let user: any;
    user = await userModel.findOne({ sEmail: sEmail, sUserRole: sUserRole })
    if (user) {
        if (user.sStatus == constant.STATUS.DELETE) {
            throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ACCOUNT_DELETED);
        }
        if (user.sStatus == constant.STATUS.INACTIVE) {
            throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ACCOUNT_DEACTIVATED);
        }
        return user
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.INCORRENT);
    }
};

const checkEmail = async (sEmail: String, sUserRole: String) => {


    let lower = sEmail;
    sEmail = lower.toLowerCase()
    let user = await userModel.findOne({ sEmail: sEmail, sStatus: { $ne: constant.STATUS.DELETE }, sUserRole: sUserRole })
    if (user) {
        return user
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.EMAIL_NOT_FOUND);
    }
};

const resetPassword = async (resetPasswordToken: any, newPassword: any) => {

    let userId: any;
    const resetPasswordTokenDoc = await tokenService.verifyToken(
        resetPasswordToken,
        constant.TOKEN_TYPE.RESET_PASSWORD

    );

    userId = resetPasswordTokenDoc.sub.user._id;

    let user = await userModel.findByIdAndUpdate(userId, { sPassword: newPassword }, { new: true });

    await Tokens.deleteOne({ token: resetPasswordToken, type: constant.TOKEN_TYPE.RESET_PASSWORD })
    return user;
};
const checkVerifyEmail = async (sEmail: String, sUserRole: String) => {
    let lower = sEmail;
    sEmail = lower.toLowerCase()
    let user: any = await userModel.findOne({ sEmail: sEmail, sStatus: { $ne: constant.STATUS.DELETE }, sUserRole: sUserRole })
    if (!user) {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.EMAIL_NOT_FOUND);
    }
    return user
}

const checkLinkToken = async (resetPasswordToken: any) => {
    let user: any;
    user = await tokenService.verifyToken(
        resetPasswordToken,
        constant.TOKEN_TYPE.VERIFICATION_TOKEN

    );

    await userModel.findByIdAndUpdate(user.sub.user._id, { isVerify: true })
    await Tokens.deleteOne({ token: resetPasswordToken, type: constant.TOKEN_TYPE.RESET_PASSWORD })
    user = await userModel.findById(user.sub.user._id, { sEmail: 1 })
    return user
};

const checkResetLinkToken = async (resetPasswordToken: any) => {
    let user: any;
    user = await tokenService.verifyToken(
        resetPasswordToken,
        constant.TOKEN_TYPE.RESET_PASSWORD

    );
    await userModel.findByIdAndUpdate(user.sub.user._id, { isVerify: true })
    user = await userModel.findById(user.sub.user._id, { sEmail: 1 })
    return user
};

const refreshAuthTokens = async (refreshToken: any) => {
    try {
        const refreshTokenDoc = await tokenService.refreshVerifyToken(refreshToken, constant.TOKEN_TYPE.REFRESH_TOKEN);
        const userId = refreshTokenDoc.sub.user;
        //console.log(refreshTokenDoc.sub.user, 'hello------');

        let user = await userModel.findOne({ _id: userId })
        //console.log({ _id: userId }, 'id--------');

        //await Tokens.deleteOne({ token: refreshToken });
        const tokenData = await tokenService.generateAuthTokens(user?._id, user?.sUserRole)
        //console.log(user?._id, '-------------');

        //console.log(user?.sUserRole, '@@@@@@@@@@@@@@@');

        return tokenData
    } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, messages.INVALIDTOKEN);
    }
};

const logout = async (userId: any) => {
    const checkToken = await Tokens.findOne({ user: userId });
    console.log("checkToken", checkToken);

    if (checkToken) {
        const token = await Tokens.deleteOne({ user: userId });
        return token
    }
    else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};


const login = async (body: any) => {


    console.log(body, 'body');

    let str = body.sEmail;
    body.sEmail = str.toLowerCase()

    let user;
    try {

        user = await getUserByEmail(body.sEmail, body.sDeviceToken, body.sDevice);
        console.log(user, 'user');

        const role = await checkRoles(user, body.sUserRole);
        console.log(role);

        //const verify = await checkVerify(user);
        //const status = await checkDisable(user);
        const password = await checkPassword(body.sPassword, user.sPassword);
        console.log("password-->", password);
        return user;
    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, error.message);
    }
};
const getUserByEmail = async (email: String, deviceToken: any, device: any) => {
    const user: any = await userModel.findOne({ sEmail: email });
    console.log(user, 'user!!!!!!!!!!!!');

    if (user) {
        await userModel.findOneAndUpdate(user.sEmail, { sDeviceToken: deviceToken, sDevice: device })
    }
    else {
        throw new AppError(httpStatus.NOT_FOUND, "Email address is not found");
    }
    return user;
};
const tokenDevice = async (deviceToken: any) => {
    let userData = await userModel.findOne({ deviceToken: deviceToken });
    console.log(userData);

    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, "Email address is not found");
    }
    return userData;
}
const checkPassword = async (password: any, correctPassword: any) => {
    const isPasswordMatch = await bcrypt.compare(password, correctPassword);
    console.log('isPasswordMatch->', isPasswordMatch);
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.INVALID);
    }
    return isPasswordMatch;
};

const checkRoles = async (user: any, role: String) => {

    if (user.sUserRole === role) {
        return true
    } else {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Not allowed to do this action."
        );
    }
};

const checkDisable = async (user: any) => {

    if (user.sStatus === 'Active') {
        return true
    } else if (user.sStatus === 'Delete') {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "This account has been deleted and is no longer active."
        );
    } else {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "This account is disabled. Please contact your account owner or administrator"
        );
    }
};

const checkVerify = async (user: any) => {
    // console.log(checkVerify)
    if (user.isVerify === true) {
        return true
    } else {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "You need to verify your email. Please check your registered email inbox or spam for account activation"
        );
    }
};

const verifyOTP = async (req: any) => {
    const checkUser = await userModel.findById(req.id);
    console.log(req.id, 'req.id');

    if (!checkUser) {
        throw new AppError(httpStatus.UNAUTHORIZED, messages.USERIDNOTPRESENT);
    }
    else {
        if (checkUser.dOtpExpire && checkUser.dOtpExpire > new Date() && req.OTP === checkUser.OTP) {
            const params = {
                OTP: null,
                dOtpExpire: null,
                isVerify: true,
                sStatus: 'Active'
            }
            const updateUser = await userModel.findByIdAndUpdate(req.id, params, { new: true });
            return updateUser
        }
        else {
            throw new AppError(httpStatus.UNAUTHORIZED, messages.WRONGOTP);
        }
    }
};

const resendOTP = async (req: any) => {
    try {
        const user = await userModel.findById(req.id);
        if (user) {
            const generateOtp = otpService.generateOtp();
            const dOtpExpire = moment().add(2, 'minutes');
            let updatedData = { OTP: generateOtp.OTP, dOtpExpire: generateOtp.otpExpiresAt };
            const updateOTP = await userModel.findByIdAndUpdate(req.id, updatedData, { new: true })
            return updateOTP
        } else {
            throw new AppError(httpStatus.UNAUTHORIZED, "fghgfg");
        }

    } catch {
        throw new AppError(httpStatus.UNAUTHORIZED, messages.USERIDNOTPRESENT);
    }
};
const loginWithEmailOtp = async (req: any) => {
    const checkUser = await userModel.findOne({ email: req.email, userRole: req.userRole, status: { $ne: 'Delete' } });
    if (!checkUser) {
        throw new AppError(httpStatus.UNAUTHORIZED, messages.OTPEXPIRED);
    } else {
        const otp = otpService.generateOtp();
        const params = {
            OTP: otp.OTP,
            dOtpExpire: otp.otpExpiresAt
        }
        const updateUser = await userModel.findByIdAndUpdate(checkUser.id, params, { new: true })
        return updateUser;
    }
};
const forgetPassword = async (req: any) => {
    const user: any = await userModel.findOne({ sEmail: req.sEmail, sUserRole: req.sUserRole });
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, messages.USERNOTFOUND);
    } else {
        const otp = otpService.generateOtp();
        const params = {
            OTP: otp.OTP,
            dOtpExpire: otp.otpExpiresAt
        }
        const updateUser = await userModel.findByIdAndUpdate(user.id, params, { new: true })
        return updateUser;
    }
    // if (user) {
    //     return user;
    // } else {
    //     throw new AppError(httpStatus.UNAUTHORIZED, messages.USERIDNOTPRESENT);
    // }
};
export default {
    register,
    login,
    //adminlogin,
    checkPassword,
    checkActive,
    checkEmail,
    resetPassword,
    checkLinkToken,
    checkResetLinkToken,
    refreshAuthTokens,
    checkDisable,
    logout,
    checkVerifyEmail,
    verifyOTP,
    resendOTP,
    loginWithEmailOtp,
    forgetPassword
}
