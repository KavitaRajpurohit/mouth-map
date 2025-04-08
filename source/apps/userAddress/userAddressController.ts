import { Request, Response, NextFunction } from 'express';
const cron = require('node-cron');
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import productServices from '../products/productServices';
import Messages from '../../common/utils/messages/english';
import English from '../../common/utils/messages/english';
import Spanish from '../../common/utils/messages/spanish'
import AppError from '../../common/utils/appError';
import userServices from '../user/userServices';
import userAddressServices from '../userAddress/userAddressServices';
import { any } from '@hapi/joi';
// const setNotification = require('../../common/utils/pushNotification');

const addUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const brand: any = await userAddressServices.addUserAddress(req.user, req.body);
        console.log(brand, 'brand--------');


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
const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const brand: any = await userAddressServices.updateAddress(req.query.id, req.body);

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
const deleteUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const video: any = await userAddressServices.deleteUserAddress(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_VIDEO, video);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_VIDEO, video);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const brand: any = await userAddressServices.getUserAddress(req.params.id);

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
const updateAddressStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const brand: any = await userAddressServices.updateAddressStatus(req.query.id, req.body);

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
const PostCodeList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const deliveriesData: any = await userAddressServices.PostCodeList(req);
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
export default {
    addUserAddress,
    updateAddress,
    deleteUserAddress,
    PostCodeList,
    getUserAddress,
    updateAddressStatus
}