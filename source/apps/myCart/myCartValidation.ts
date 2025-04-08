import Joi from '@hapi/joi';
import { deflate } from 'zlib';
import message from '../../common/utils/messages/english';

const addMyCart = {
    body: Joi.object().keys({
        sTotalAmount: Joi.number().allow('', null),
        //shippingPrice: Joi.number(),
        oShippingId: Joi.string(),
        sGrandAmount: Joi.number().allow('', null),
        //sRepeats: Joi.number().allow('', null),
        product: Joi.array().allow('', null),
        //sDiscount: Joi.string().allow('', 0),
        sStatus: Joi.string().allow('', null),
        shippingId: Joi.string().allow('', null),
        billingId: Joi.string().allow('', null),
        // sQuantity: Joi.number(),
        //sMonthly_subScription: Joi.boolean()

    })
};
const cartList = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number(),
        //subscription: Joi.boolean()
    })
};
const updateCart = {
    body: Joi.object().keys({
        oCartId: Joi.string(),
        oProductId: Joi.string(),
        sPrice: Joi.number().allow('', null),
        sDiscount: Joi.string().allow('', 0),
        sQuantity: Joi.number().allow('', null)
        //sMonthly_subScription: Joi.boolean()


    })
};
const addMyCartProduct = {
    body: Joi.object().keys({
        oCartId: Joi.string(),
        oProductId: Joi.string(),
        sPrice: Joi.number(),
        sDiscount: Joi.string().allow('', 0),
        sQuantity: Joi.number(),
        sMonthly_subScription: Joi.boolean()


    })
};
export default {
    addMyCart,
    cartList,
    updateCart,
    addMyCartProduct
}