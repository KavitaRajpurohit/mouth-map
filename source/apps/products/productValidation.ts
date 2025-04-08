import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';
// import languageUsed from './../../common/midlewares/languageGet';

const createProduct = {
    body: Joi.object().keys({
        oBrandId: Joi.string().allow('', null),
        userId: Joi.string().allow('', null),
        sName: Joi.string().allow('', null),
        sProductImage: Joi.array().allow('', null),
        sDescription: Joi.string().allow('', null),
        nPrice: Joi.number().allow('', null),
        sMonthly_subScription: Joi.boolean().allow('', null),
        sOrderId: Joi.string().allow('', null)

    })
};

const allProduct = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number()
    })
};

const updateProduct = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        oBrandId: Joi.string(),
        sName: Joi.string(),
        sProductImage: Joi.array(),
        sDescription: Joi.string(),
        nPrice: Joi.number(),
        sMonthly_subScription: Joi.boolean(),
    })
};

const updateStatusProduct = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        sStatus: Joi.string()
    })
};

export default {
    createProduct,
    allProduct,
    updateProduct,
    updateStatusProduct

}