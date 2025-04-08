import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';

const getAllUser = {
    query: Joi.object().keys({
        search: Joi.string(),
        page: Joi.number(),
        limit: Joi.number(),
        sortBy: Joi.string(),
        key: Joi.string(),
        payment: Joi.boolean(),
        subscription: Joi.boolean()
    })
}

const updateStatusUser = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        sStatus: Joi.string()
    })
}
const updateUserAddress = {
    // query: Joi.object().keys({
    //     id: Joi.string().required()
    // }),
    body: Joi.object().keys({
        sAddress: Joi.array(),
    })
};
const createNotification = {
    body: Joi.object().keys({
        title: Joi.string(),
        message: Joi.string().required(),
        userId: Joi.string().required(),
    })
};
const updateUser = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        isOnboarding: Joi.boolean(),
    })
};
const getUser = {
    query: Joi.object().keys({
        search: Joi.string(),
        page: Joi.number(),
        limit: Joi.number(),
        subscription: Joi.boolean()
    })
};
const oneTimeProduct = {
    query: Joi.object().keys({
        search: Joi.string(),
        page: Joi.number(),
        limit: Joi.number()
    })
};
const subScribedProduct = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number()
    })
};
const unSubScribeProduct = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number()
    })
};

export default {
    getAllUser,
    updateStatusUser,
    updateUserAddress,
    createNotification,
    updateUser,
    getUser,
    oneTimeProduct,
    subScribedProduct,
    unSubScribeProduct
}