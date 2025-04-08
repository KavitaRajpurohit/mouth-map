import { Request, Response, NextFunction, query } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import promoServices from '../promocode/promoServices';
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

const addPromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const promocode: any = await promoServices.addPromoCode(req.body);
        console.log("PromoCode", promocode)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_PROMO_CODE, promocode);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_PROMO_CODE, promocode);
        }
        //createResponse(res, httpStatus.OK, `New ${promocode.sApplicabletype} has been added successfully.`, promocode);
    }
    catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const editPromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const promocode: any = await promoServices.editPromoCode(req.query.id, req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_PROMO_CODE, promocode);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_PROMO_CODE, promocode);
        }
        //createResponse(res, httpStatus.OK, `${promocode.sPromocode} has been updated successfully.`, promocode);
    }
    catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getPromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const promocode: any = await promoServices.getPromoCode(req);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_PROMO_CODE, promocode);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_PROMO_CODE, promocode);
        }
        //createResponse(res, httpStatus.OK, Messages.GET_ALL_PROMOCODE, promocode)
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const deletePromoCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const promocode: any = await promoServices.deletePromoCode(req.params.id);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_PROMO_CODE, promocode);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_PROMO_CODE, promocode);
        }
        //createResponse(res, httpStatus.OK, ` has been deleted successfully.`, promocode)
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getAppicablePcode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const promocode: any = await promoServices.getAppicablePcode(req.query);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_PROMO_CODE, promocode);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_PROMO_CODE, promocode);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
export default {
    addPromoCode,
    editPromoCode,
    getPromoCode,
    deletePromoCode,
    getAppicablePcode
}