import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import myCartServices from '../myCart/myCartServices';
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


const addMyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myCart: any = await myCartServices.addMyCart(req.user, req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_CART, myCart);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_CART, myCart);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const addMyCartProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myCart: any = await myCartServices.addMyCartProduct(req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_CART, myCart);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_CART, myCart);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getAllCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await myCartServices.getAllCart(req.user, req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_CART, category);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_CART, category);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const deleteProductCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const myCart: any = await myCartServices.deleteProductCart(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_CART, myCart);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_CART, myCart);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const myCart: any = await myCartServices.deleteCart(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_CART, myCart);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_CART, myCart);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};


const updateMyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await myCartServices.updateMyCart(req.body)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_CATEGORY, category);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_CATEGORY, category);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const addShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const addShipping: any = await myCartServices.addShipping(req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_CART, addShipping);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_CART, addShipping);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getShipping = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const addShipping: any = await myCartServices.getShipping(req.query);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_CART, addShipping);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_CART, addShipping);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
export default {

    addMyCart,
    getAllCart,
    deleteCart,
    updateMyCart,
    addShipping,
    getShipping,
    addMyCartProduct,
    deleteProductCart
}