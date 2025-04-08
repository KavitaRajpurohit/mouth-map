import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';
// import languageUsed from './../../common/midlewares/languageGet';

const createOrder = {
    body: Joi.object().keys({
        oCartId: Joi.string(),
        shippingId: Joi.string().allow('', null),
        billingId: Joi.string().allow('', null),

    })
};
const getAllOrder = {
    query: Joi.object().keys({
        search: Joi.string(),
        page: Joi.number(),
        limit: Joi.number(),
        product: Joi.string().allow('', null),
        brand: Joi.string().allow('', null),
        key: Joi.string().allow('', null),
    })
};
const filterOrder = {
    query: Joi.object().keys({
        status: Joi.string().allow('', null),
        subscription: Joi.boolean().allow('', null)
    })
};
const updateQuantity = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        sQuantity: Joi.number(),
    })
};
export default {
    createOrder,
    getAllOrder,
    filterOrder,
    updateQuantity
}