import Joi, { number } from '@hapi/joi';
import { deflate } from 'zlib';
import message from '../../common/utils/messages/english';

const addMyRoutine = {
    body: Joi.object().keys({
        userId: Joi.string(),
        oBrandId: Joi.array(),
        sClinicianCode: Joi.array().allow('', null),
        // oRoutineId: Joi.string().allow('', null)
    })
};
const updateMyRoutine = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        userId: Joi.string(),
        oBrandId: Joi.array(),
        sBrushColor: Joi.array(),
        sBrushPinSize: Joi.array(),
        sClinicianCode: Joi.array().allow('', null),
        mouthUpperTeeth: Joi.array(),
        mouthDownTeeth: Joi.array(),
    })
};
export default {

    addMyRoutine,
    updateMyRoutine
}