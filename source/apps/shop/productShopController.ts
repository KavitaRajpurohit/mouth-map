import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import productShopServices from '../shop/productShopServices';
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



const getallProducts = async (req: Request, res: Response, next: NextFunction) => {
    console.log('kavya--------');

    try {
        const language = req.header('language');

        const product: any = await productShopServices.getallProduct(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_PRODUCT, product);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_PRODUCT, product);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const productDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const product: any = await productShopServices.productDetails(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_PRODUCT, product);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_PRODUCT, product);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

export default {
    getallProducts,
    productDetails

}