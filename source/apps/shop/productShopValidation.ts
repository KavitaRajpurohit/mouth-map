import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';


const allProduct = {
    query: Joi.object().keys({
        search: Joi.string().allow(''),
        brandData: Joi.string().allow(''),
        page: Joi.number(),
        limit: Joi.number(),

    })
};

export default {
    allProduct
}