import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import userServices from '../../apps/user/userServices'
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
const setNotification = require('../../common/utils/pushNotification');


const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const user: any = await userServices.getAllUser(req.query);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.USER_LIST, user);
        }
        else {
            createResponse(res, httpStatus.OK, English.USER_LIST, user);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateStatusUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = await userServices.updateStatusUser(req.body.id, { sStatus: req.body.sStatus });
        if (req.body.sStatus === 'Active') {
            createResponse(res, httpStatus.OK, 'User has been enabled successfully.', user);
        } else if (req.body.sStatus === 'Inactive') {
            createResponse(res, httpStatus.OK, 'User has been disabled successfully.', user);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const user: any = await userServices.deleteUser(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.USER_DELETE, user);
        }
        else {

            createResponse(res, httpStatus.OK, English.USER_DELETE, user);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const addUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const userAddress: any = await userServices.addUserAddress(req.user, req.body);



        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_ADDRESS, userAddress);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_ADDRESS, userAddress);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getAllUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const user: any = await userServices.getAllUserAddress(req.body);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.USER_LIST, user);
        }
        else {
            createResponse(res, httpStatus.OK, English.USER_LIST, user);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const product = await userServices.createNotification(req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_PRODUCT, product);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_PRODUCT, product);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const product = await userServices.getNotification(req.user);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.ADD_PRODUCT, product);
        } else {
            createResponse(res, httpStatus.OK, English.ADD_PRODUCT, product);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const notificationMarkRead = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const notificationData = await userServices.notificationMarkRead(req.user);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.READ_DATA, notificationData);
        } else {
            createResponse(res, httpStatus.OK, English.READ_DATA, notificationData);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const readNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const product = await userServices.readNotification(req.query);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_PRODUCT, product);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_PRODUCT, product);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const unReadNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const product = await userServices.unReadNotification(req.query);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_PRODUCT, product);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_PRODUCT, product);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const oneUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const user: any = await userServices.oneUser(req);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.USER_LIST, user);
        }
        else {
            createResponse(res, httpStatus.OK, English.USER_LIST, user);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await userServices.updateUser(req.query.id, req.body)

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
const singleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');
        console.log("kavya==========");

        const user: any = await userServices.singleUser(req.params.id);
        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.USER_LIST, user);
        }
        else {
            createResponse(res, httpStatus.OK, English.USER_LIST, user);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getCountryList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const abouts: any = await userServices.getCountryList();


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
const getStateList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const abouts: any = await userServices.getStateList(req.query);


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
const getCityList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const abouts: any = await userServices.getCityList(req.query);


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
const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const abouts: any = await userServices.deleteAddress(req.user, req.params.id);


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
const oneTimeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await userServices.oneTimeProduct(req.query);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ORDER, myRoutine);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ORDER, myRoutine);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const subScribeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await userServices.subScribeProduct(req.query);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ORDER, myRoutine);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ORDER, myRoutine);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const unSubScribeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await userServices.unSubScribeProduct(req.query);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ORDER, myRoutine);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ORDER, myRoutine);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const user: any = await userServices.getOneUser(req.user);
        console.log(req, 'req------');

        if (language == 'Spanish') {
            createResponse(res, httpStatus.OK, Spanish.USER_LIST, user);
        }
        else {
            createResponse(res, httpStatus.OK, English.USER_LIST, user);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};



export default {
    getAllUser,
    updateStatusUser,
    deleteUser,
    addUserAddress,
    getAllUserAddress,
    createNotification,
    getNotification,
    notificationMarkRead,
    oneUser,
    updateUser,
    singleUser,
    getCountryList,
    getStateList,
    getCityList,
    deleteAddress,
    oneTimeProduct,
    subScribeProduct,
    unSubScribeProduct,
    getOneUser,
    readNotification,
    unReadNotification
}