import { Request, Response, NextFunction } from 'express';
const cron = require('node-cron');
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import productServices from '../products/productServices';
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
import userServices from '../user/userServices';
import { any } from '@hapi/joi';
const setNotification = require('../../common/utils/pushNotification');

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');
        //let { user }: any = req.user;
        console.log(req.user, 'req.user');

        //let { sEmail } = req.body;

        const product: any = await productServices.createProduct(req.body);
        console.log(req.body, 'hello');

        //await emailService.NewUserSubscribed(sEmail, user);
        //console.log(sEmail, 'kavya');

        //await setNotification({ "title": "Congratulations! You have successfully product launched.", "message": "Testing Testing" })
        await userServices.createNotification({ "title": "New product launched!", "message": "New product has been launched." })
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.ADD_PRODUCT, product);
        } else {
            createResponse(res, httpStatus.OK, English.ADD_PRODUCT, product);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getallProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const product: any = await productServices.getallProduct(req.query);
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

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const product: any = await productServices.updateProduct(req.query.id, req.body)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_PRODUCT, product);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_PRODUCT, product);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const product: any = await productServices.deleteProduct(req.params.id);
        console.log(product, 'product--------');

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_PRODUCT, product);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_PRODUCT, product);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateStatusProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const product: any = await productServices.updateStatusProduct(req.body.id, { sStatus: req.body.sStatus });
        if (req.body.sStatus === 'Active') {
            createResponse(res, httpStatus.OK, 'Product has been enabled successfully.', product);
        } else if (req.body.sStatus === 'Inactive') {
            createResponse(res, httpStatus.OK, 'Product has been disabled successfully.', product);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const allProductList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const product: any = await productServices.allProductList(req.query);
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
const myBrushList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const product: any = await productServices.myBrushList(req.query);
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
    createProduct,
    getallProducts,
    updateProduct,
    deleteProduct,
    updateStatusProduct,
    allProductList,
    myBrushList
}