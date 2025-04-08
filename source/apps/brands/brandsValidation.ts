import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';
// import languageUsed from './../../common/midlewares/languageGet';

const createBrand = {
    body: Joi.object().keys({
        sBrandName: Joi.string(),
    })
};

const allBrands = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number()
    })
};

const updateBrand = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        sBrandName: Joi.string(),
    })
};

const updateStatusBrand = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        sStatus: Joi.string()
    })
};

export default {
    createBrand,
    allBrands,
    updateBrand,
    updateStatusBrand
}