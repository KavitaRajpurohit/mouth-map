import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import routineServices from '../../apps/myRoutine/routineServices';
import Messages from '../../common/utils/messages/english';
import English from '../../common/utils/messages/english';
import Spanish from '../../common/utils/messages/spanish'
import tokenService from '../../common/services/tokenService';
import AppError from '../../common/utils/appError';
import auth from '../../common/middlewares/auth';


const addRoutine = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await routineServices.addRoutine(req.user, req.body);
        console.log(req, "request-------");


        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_ROUTINE, myRoutine);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_ROUTINE, myRoutine);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateRoutine = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await routineServices.updateRoutine(req.user, req.query.id, req.body);
        console.log(req, "request-------");


        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_ROUTINE, myRoutine);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_ROUTINE, myRoutine);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getRoutine = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await routineServices.getRoutine(req.user);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ROUTINE, myRoutine);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ROUTINE, myRoutine);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getBrandData = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const myRoutine: any = await routineServices.getBrandData(req.user);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_BRAND, myRoutine);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_BRAND, myRoutine);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

export default {
    addRoutine,
    getRoutine,
    getBrandData,
    updateRoutine

}