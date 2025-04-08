import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';

const updateUser = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        sBrandName: Joi.string(),
    })
};
export default {
    updateUser
}