import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';

const addUserAddress = {
    body: Joi.object().keys({
        fullName: Joi.string(),
        sHouseNo: Joi.string(),
        sAddressLine1: Joi.string().allow('', null),
        sAddressLine2: Joi.string().allow('', null),
        sPostCode: Joi.string(),
        sCountryName: Joi.object().allow('', null),
        stateName: Joi.object().allow('', null),
        sCityName: Joi.object().allow('', null),
        defaultAddress: Joi.boolean().allow('', null)
    })
};
const updateUserAddress = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        fullName: Joi.string().allow('', null),
        sHouseNo: Joi.string().allow('', null),
        sAddressLine1: Joi.string().allow('', null),
        sAddressLine2: Joi.string().allow('', null),
        sPostCode: Joi.string().allow('', null),
        sCountryName: Joi.object().allow('', null),
        stateName: Joi.object().allow('', null),
        sCityName: Joi.object().allow('', null),
        defaultAddress: Joi.boolean().allow('', null)
    })
};
export default {
    addUserAddress,
    updateUserAddress
}