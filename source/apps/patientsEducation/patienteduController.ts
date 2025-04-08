import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import patienteduServices from '../patientsEducation/patienteduServices';
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

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const category: any = await patienteduServices.createCategory(req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_CATEGORY, category);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_CATEGORY, category);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getallCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await patienteduServices.getallCategory(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_CATEGORY, category);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_CATEGORY, category);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await patienteduServices.updateCategory(req.query.id, req.body)

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

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await patienteduServices.deleteCategory(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_CATEGORY, category);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_CATEGORY, category);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateStatusCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await patienteduServices.updateStatusCategory(req.body.id, { sStatus: req.body.sStatus });
        console.log(category, 'category');

        if (req.body.sStatus === 'Active') {
            createResponse(res, httpStatus.OK, 'Category has been enabled successfully.', category);
        } else if (req.body.sStatus === 'Inactive') {
            createResponse(res, httpStatus.OK, 'Category has been disabled successfully.', category);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const article: any = await patienteduServices.createArticle(req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_ARTICLE, article);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_ARTICLE, article);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const article: any = await patienteduServices.updateArticle(req.query.id, req.body)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_ARTICLE, article);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_ARTICLE, article);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const updatePinStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const article: any = await patienteduServices.updatePinStatus(req.body)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_ARTICLE, article);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_ARTICLE, article);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const updateunPinStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const article: any = await patienteduServices.updateunPinStatus(req.body)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_ARTICLE, article);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_ARTICLE, article);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};


const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const article: any = await patienteduServices.deleteArticle(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.DELETE_ARTICLE, article);
        }
        else {

            createResponse(res, httpStatus.OK, English.DELETE_ARTICLE, article);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateStatusArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const article: any = await patienteduServices.updateStatusArticle(req.body.id, { sStatus: req.body.sStatus });
        if (req.body.sStatus === 'Active') {
            createResponse(res, httpStatus.OK, 'Article has been enabled successfully.', article);
        } else if (req.body.sStatus === 'Inactive') {
            createResponse(res, httpStatus.OK, 'Article has been disabled successfully.', article);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getallArticle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const article: any = await patienteduServices.getallArticle(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_ARTICLE, article);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_ARTICLE, article);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getPatientList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const article: any = await patienteduServices.getPatientList(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_ARTICLE, article);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_ARTICLE, article);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const createVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const video: any = await patienteduServices.createVideo(req.user, req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_VIDEO, video);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_VIDEO, video);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await patienteduServices.updateVideo(req.query.id, req.body)

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.UPDATE_VIDEO, category);
        }
        else {

            createResponse(res, httpStatus.OK, English.UPDATE_VIDEO, category);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const video: any = await patienteduServices.deleteVideo(req.params.id);
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

const updateStatusVideo = async (req: Request, res: Response, next: NextFunction) => {
    console.log('kavya');

    try {
        const language = req.header('language');

        const video: any = await patienteduServices.updateStatusVideo(req.body.id, { sStatus: req.body.sStatus });
        console.log('video-------------');

        if (req.body.sStatus === 'Active') {
            createResponse(res, httpStatus.OK, 'video has been enabled successfully.', video);
        } else if (req.body.sStatus === 'Inactive') {
            createResponse(res, httpStatus.OK, 'video has been disabled successfully.', video);
        }
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const getallVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const video: any = await patienteduServices.getallVideo(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_VIDEO, video);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_VIDEO, video);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};

const patientDetails = async (req: Request, res: Response, next: NextFunction) => {
    console.log('kavya--------');

    try {
        const language = req.header('language');

        const patientData: any = await patienteduServices.patientDetails(req.params.id);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_PRODUCT, patientData);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_PRODUCT, patientData);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const allCategoryList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const category: any = await patienteduServices.allCategoryList(req.query);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_CATEGORY, category);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_CATEGORY, category);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const addMyVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const language = req.header('language');

        const video: any = await patienteduServices.addMyVideo(req.user, req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.ADD_VIDEO, video);
        }
        else {

            createResponse(res, httpStatus.OK, English.ADD_VIDEO, video);
        }


    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getMyVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const video: any = await patienteduServices.getMyVideo(req.user);
        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.GET_ALL_VIDEO, video);
        }
        else {

            createResponse(res, httpStatus.OK, English.GET_ALL_VIDEO, video);

        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const deleteMyVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const video: any = await patienteduServices.deleteMyVideo(req.params.id);
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

export default {
    createCategory,
    getallCategory,
    updateCategory,
    deleteCategory,
    updateStatusCategory,
    createArticle,
    updateArticle,
    deleteArticle,
    updateStatusArticle,
    getallArticle,
    createVideo,
    updateVideo,
    deleteVideo,
    updateStatusVideo,
    getallVideo,
    patientDetails,
    allCategoryList,
    addMyVideo,
    getMyVideo,
    deleteMyVideo,
    getPatientList,
    updatePinStatus,
    updateunPinStatus
}