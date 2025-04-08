import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import profileServices from './profileServices';
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

const editProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');
        const user: any = await profileServices.updateProfile(req.query.id, req.body);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.UPDATE_PROFILE, user);
        }
        else {
            createResponse(res, httpStatus.OK, English.UPDATE_PROFILE, user);

        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const user = await profileServices.checkUserById(req.user);
        const customer: any = await profileServices.changePassword(req.user, req.body, user);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.RESET_PASSWORD, customer);
        } else {
            createResponse(res, httpStatus.OK, English.RESET_PASSWORD, customer);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

export default {
    editProfile,
    changePassword
}