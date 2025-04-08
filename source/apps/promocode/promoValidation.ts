import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';
// import languageUsed from './../../common/midlewares/languageGet';

const addPromoCode = {
    body: Joi.object().keys({
        sApplicabletype: Joi.string().required(),
        sPromocode: Joi.string().required(),
        sValiditydate: Joi.string().required(),
        sPromoDes: Joi.string().required(),
        sCriteria: Joi.string().required(),
        sDiscount: Joi.string().when('sCriteria', { is: 'discount', then: Joi.string().required() }),
        sAmount: Joi.string().when('sCriteria', { is: 'flatdiscount', then: Joi.string().required() }),
        sMinproductval: Joi.string().required(),
        sRecurrence: Joi.string(),
        sRepeats: Joi.number()
    })
};

const editPromoCode = {
    body: Joi.object().keys({
        sApplicabletype: Joi.string(),
        sPromocode: Joi.string(),
        sValiditydate: Joi.string(),
        sPromoDes: Joi.string(),
        sCriteria: Joi.string(),
        sDiscount: Joi.string(),
        sAmount: Joi.string(),
        sMinproductval: Joi.string(),
        sRecurrence: Joi.string(),
        sRepeats: Joi.number()
    })
};

const getPromoCode = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number()
    })
};

const deletePromoCode = {
    query: Joi.object().keys({
        id: Joi.string().required()
    })
};
const getAppicablePcode = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        //dateFilter: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number(),
        sMinproductval: Joi.string().allow('', null),
    })
}

export default {
    addPromoCode,
    editPromoCode,
    getPromoCode,
    deletePromoCode,
    getAppicablePcode
}