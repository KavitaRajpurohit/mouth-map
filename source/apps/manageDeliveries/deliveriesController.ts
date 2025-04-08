import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import deliveriesServices from './deliveriesServices';
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

const getDeliveriesList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const deliveriesData: any = await deliveriesServices.getDeliveriesList(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_BRAND, deliveriesData);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_BRAND, deliveriesData);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const orderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const deliveriesData: any = await deliveriesServices.orderDetails(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_BRAND, deliveriesData);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_BRAND, deliveriesData);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const orderDeliveriesStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await deliveriesServices.orderDeliveriesStatus(req.body.oCartId, { sStatus: req.body.sStatus });
        console.log(req.body.id, 'kavya');

        if (req.body.sStatus === 'Active') {
            createResponse(res, httpStatus.OK, 'Brand has been enabled successfully.', brand);
        } else if (req.body.sStatus === 'Inactive') {
            createResponse(res, httpStatus.OK, 'Brand has been disabled successfully.', brand);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

export default {
    getDeliveriesList,
    orderDetails,
    orderDeliveriesStatus
}