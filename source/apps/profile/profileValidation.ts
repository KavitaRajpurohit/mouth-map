import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';
// import languageUsed from './../../common/midlewares/languageGet';

const editProfile = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        sFirstName: Joi.string(),
        sLastName: Joi.string(),
        sProfileImage: Joi.string().allow('', null)
    })
};

const changePassword = {
    body: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        //confirmPassword: Joi.string().required()
    })
};

export default {
    editProfile,
    changePassword
}