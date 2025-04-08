
import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';

const createCard = {
    body: Joi.object().keys({
        token: Joi.string().allow('', null),
        nPrice: Joi.number().allow('', null),
        productId: Joi.string().allow('', null),
        customerId: Joi.string().allow('', null)
    })
}
const createCustomer = {
    body: Joi.object().keys({
        token: Joi.string().allow('', null),
        nPrice: Joi.number().allow('', null),
        productId: Joi.string().allow('', null),
        customerId: Joi.string().allow('', null)
    })
}
const addNewCard = {
    body: Joi.object().keys({
        token: Joi.string().allow('', null),
        //sStripeCustomerId: Joi.string().allow('', null),
        //customerId: Joi.string().allow('', null)
    })
}
const updateCard = {
    body: Joi.object().keys({
        customerId: Joi.string().required(),
        cardId: Joi.string().required(),
        updatedData: Joi.object().required(),
    })
};
const getAllCard = {
    query: Joi.object().keys({
        customerId: Joi.string().required(),
    })
};
const deleteCard = {
    query: Joi.object().keys({
        customerId: Joi.string().required(),
        cardId: Joi.string().required(),
    })
}
export default {
    createCard,
    createCustomer,
    addNewCard,
    updateCard,
    getAllCard,
    deleteCard
}