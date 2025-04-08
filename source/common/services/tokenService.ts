import moment from "moment";
import jwt from "jsonwebtoken";
import constants from "./../config/constant";
import config from './../config/config'
// import tokens from "../models/document/TokenModel";

import httpStatus from 'http-status';
import Tokens from '../../model/tokenModel';
import appError from '../../common/utils/appError';
import mongoose from 'mongoose';
import messages from '../../common/utils/messages/english';


// const generateAuthTokens = async (userId: any, role: any) => {
//     const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//     const accessToken = generateToken(userId, role, accessTokenExpires);
//     const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
//     const refreshToken = generateToken(userId, role, refreshTokenExpires);
//     await saveToken(refreshToken, userId, refreshTokenExpires, constants.TOKEN_TYPE.REFRESH_TOKEN);

//     return {
//         access: {
//             token: accessToken,
//             expires: accessTokenExpires.toDate(),
//         },
//         refresh: {
//             token: refreshToken,
//             expires: refreshTokenExpires.toDate(),
//         },
//     };
// };

const generateToken = (user: any, role: any, expires: { unix: () => any; }, secret = config.jwt.secret) => {
    const payload = {
        sub: { user, role },
        iat: moment().unix(),
        exp: expires.unix()
    };
    return jwt.sign(payload, secret);
};
const saveToken = async (token: any, userId: any, expires: moment.Moment, type: any, blacklisted = false) => {
    const tokenDoc = await Tokens.create({
        token,
        user: userId,
        expiresAt: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};
const generateAuthTokens = async (userId: any, role: any) => {
    console.log(userId, '!!!!!!!!!!!!!!!!');

    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    console.log(accessTokenExpires, 'accessTokenExpires-------------');

    const accessToken = generateToken(userId, role, accessTokenExpires);
    console.log("accessToken", accessToken);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    console.log(config.jwt.refreshExpirationDays, 'kavya');

    const refreshToken = generateToken(userId, role, refreshTokenExpires);
    await saveToken(refreshToken, userId, refreshTokenExpires, constants.TOKEN_TYPE.REFRESH_TOKEN);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};
const generateResetPasswordToken = async (data: any) => {
    const expires = moment().add(
        config.jwt.resetPasswordExpirationMinutes,
        "minutes"
    )
    const resetPasswordToken = generateToken(
        { _id: data._id }, data.userRole,
        expires
    );
    await saveToken(resetPasswordToken, data._id, expires, constants.TOKEN_TYPE.RESET_PASSWORD);

    return resetPasswordToken;
};

// const generateResetPasswordToken = async (data: any) => {
//     const expires = moment().add(
//         config.jwt.resetPasswordExpirationMinutes,
//         "minutes"
//     )
//     const resetPasswordToken = generateToken(
//         { _id: data._id }, data.userRole,
//         expires
//     );
//     await saveToken(resetPasswordToken, data._id, expires, constants.TOKEN_TYPE.RESET_PASSWORD, data.sUserRole);

//     return resetPasswordToken;
// };

const generateVerifyPasswordToken = async (data: any) => {
    const expires = moment().add(
        config.jwt.resetPasswordExpirationMinutes,
        "minutes"
    )
    const resetPasswordToken = generateToken(
        { _id: data._id }, data.userRole,
        expires
    );
    await saveToken(resetPasswordToken, data._id, expires, constants.TOKEN_TYPE.VERIFICATION_TOKEN);


    return resetPasswordToken;
};

const verifyToken = async (token: any, type: any) => {
    console.log("rajpurohit");
    try {
        const payload: any = jwt.verify(token, config.jwt.secret);
        console.log(payload, 'payload--------');

        const tokenDoc: any = await Tokens.findOne({ token: token, type: type, user: new mongoose.Types.ObjectId(payload.sub.user._id) });
        console.log(tokenDoc, 'token');
        console.log(type, 'type------');
        console.log(payload.sub.user, 'payload.sub.user-------');

        if (!tokenDoc) {
            throw new appError(httpStatus.NOT_FOUND, 'The link has expired!');
        }
        return payload;
    } catch (error) {
        throw new appError(httpStatus.UNAUTHORIZED, messages.INVALIDTOKEN);
    }


};
// const deleteUserToken = async (userId: any) => {
//     console.log("hello rajpurohit");

//     return await Tokens.deleteMany({ user: new mongoose.Types.ObjectId(userId) }, "User is not reset password");
// };

const refreshVerifyToken = async (token: any, type: any) => {
    const payload: any = jwt.verify(token, config.jwt.secret);
    console.log(token, config.jwt.secret, 'token');

    const tokenDoc: any = await Tokens.findOne({ token, type, user: payload.sub.user });
    if (!tokenDoc) {
        throw new appError(httpStatus.NOT_FOUND, 'The link has been expired!');
    }
    return payload;
};

export default {
    generateAuthTokens,
    generateResetPasswordToken,
    verifyToken,
    generateVerifyPasswordToken,
    refreshVerifyToken,
    //deleteUserToken
}