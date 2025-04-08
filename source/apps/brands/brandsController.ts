import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import brandServices from '../brands/brandsServices';
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

const createBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const brand: any = await brandServices.createBrand(req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_BRAND, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_BRAND, brand);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getallBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await brandServices.getallBrand(req.query);
        if (language == 'Spanish') {
            console.log(language, 'language---------');

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_BRAND, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_BRAND, brand);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};



const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await brandServices.updateBrand(req.query.id, req.body)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_BRNAD, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_BRNAD, brand);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await brandServices.deleteBrand(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_BRAND, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_BRAND, brand);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateStatusBrand = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await brandServices.updateStatusBrand(req.body.id, { sStatus: req.body.sStatus });
        if (req.body.sStatus === 'Active') {
            createResponse(res, httpStatus.OK, 'Brand has been enabled successfully.', brand);
        } else if (req.body.sStatus === 'Inactive') {
            createResponse(res, httpStatus.OK, 'Brand has been disabled successfully.', brand);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const brandAllList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await brandServices.brandAllList(req.query);
        if (language == 'Spanish') {
            console.log(language, 'language---------');

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_BRAND, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_BRAND, brand);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

export default {
    createBrand,
    getallBrand,
    updateBrand,
    deleteBrand,
    updateStatusBrand,
    brandAllList
}