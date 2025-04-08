import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createResponse from '../../common/utils/response';
import mapServices from '../../apps/mouth/mapServices';
import Messages from '../../common/utils/messages/english';
import English from '../../common/utils/messages/english';
import Spanish from '../../common/utils/messages/spanish'


const mouthTeeth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const teethData: any = await mapServices.mouthTeeth(req.user, req.body);

        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.TEETH_DATA, teethData);
        }
        else {

            createResponse(res, httpStatus.OK, English.TEETH_DATA, teethData);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};
const getmouthTeeth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const language = req.header('language');

        const teethData: any = await mapServices.getmouthTeeth(req.params.id);


        if (language == 'Spanish') {

            createResponse(res, httpStatus.OK, Spanish.TEETH_DATA, teethData);
        }
        else {

            createResponse(res, httpStatus.OK, English.TEETH_DATA, teethData);
        }

    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
};


export default {
    mouthTeeth,
    getmouthTeeth,
}