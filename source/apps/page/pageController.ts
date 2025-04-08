import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import pageServices from '../../apps/page/pageServices';
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


const aboutus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const abouts: any = await pageServices.aboutus(req.body);


        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ABOUT_DATA, abouts);
        }
        else {

            createResponse(res, httpStatus.OK, English.ABOUT_DATA, abouts);
        }
        
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

export default {
    aboutus
}