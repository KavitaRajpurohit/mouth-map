import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import orderServices from '../../apps/order/orderServices'
import routineServices from '../../apps/myRoutine/routineServices';
import Messages from '../../common/utils/messages/english';
import English from '../../common/utils/messages/english';
import Spanish from '../../common/utils/messages/spanish'
import tokenService from '../../common/services/tokenService';
import AppError from '../../common/utils/appError';
import auth from '../../common/middlewares/auth';


const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const brand: any = await orderServices.createOrder(req.user, req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_ORDER, brand);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_ORDER, brand);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getOderList = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.getOderList(req.query, req.user);

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
const getPendingOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.getPendingOrder(req.user);

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
const getOnTheWayOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.getOnTheWayOrder(req.user);

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
const getDeliveredOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.getDeliveredOrder(req.user);

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
const viewOrderList = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.viewOrderList(req.query);

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
const orderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.orderDetails(req.query);

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
const oneTimeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.oneTimeProduct(req.query);

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

        const myRoutine: any = await orderServices.subScribeProduct(req.query);

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
const userOneTimeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.userOneTimeProduct(req.user, req.query);

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
const userSubScribeProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await orderServices.userSubScribeProduct(req.user, req.query);

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
const updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const brand: any = await orderServices.updateQuantity(req.query.id, req.body)

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


export default {
    createOrder,
    getOderList,
    getPendingOrder,
    getOnTheWayOrder,
    getDeliveredOrder,
    viewOrderList,
    orderDetails,
    oneTimeProduct,
    subScribeProduct,
    userOneTimeProduct,
    userSubScribeProduct,
    updateQuantity
}