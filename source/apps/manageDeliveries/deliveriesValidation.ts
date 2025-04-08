import Joi from '@hapi/joi';
import { join } from 'path';
import message from '../../common/utils/messages/english';


const manageDeliveriesList = {
    query: Joi.object().keys({
        status: Joi.string(),
        dateFilter: Joi.string(),
        Postcode: Joi.string(),
        page: Joi.number(),
        limit: Joi.number()
    })
};
const orderDetails = {
    query: Joi.object().keys({
        status: Joi.string(),
        page: Joi.number(),
        limit: Joi.number()
    })
};
const orderDeliveriesStatus = {
    body: Joi.object().keys({
        oCartId: Joi.string().required(),
        sStatus: Joi.string()
    })
};


export default {
    manageDeliveriesList,
    orderDetails,
    orderDeliveriesStatus

}