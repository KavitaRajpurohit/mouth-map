import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';
// import languageUsed from './../../common/midlewares/languageGet';

const register = {
    body: Joi.object().keys({
        sFirstName: Joi.string().required(),
        sLastName: Joi.string().required(),
        sEmail: Joi.string().required(),
        sPassword: Joi.string().required(),
        //oRoutineId: Joi.string().allow('', null),
        //sOrderId: Joi.string().allow('', null),
        //oProductId: Joi.string(),
        subscribed: Joi.boolean(),
        sClinicianCode: Joi.array().allow('', null),
        sDeviceToken: Joi.string().allow('',),
        sDevice: Joi.string().allow('',),
        sStripeCustomerId: Joi.string().allow('', null),
    })
};

const login = {
    body: Joi.object().keys({
        sEmail: Joi.string().required(),
        sPassword: Joi.string().required(),
        sUserRole: Joi.string().required(),
        sDeviceToken: Joi.string().allow('',),
        sDevice: Joi.string().allow('',)

    })
};

const forgotPassword = {
    body: Joi.object().keys({
        sEmail: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email address is required.'
        }),
        sUserRole: Joi.string().required()
    }),
};

const resetPassword = {
    params: Joi.object().keys({
        token: Joi.string().required()
    }),
    body: Joi.object().keys({
        sPassword: Joi.string()
            .required()
            .messages({
                'string.empty': "New password cannot be empty."
            }),
    })
};

const refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const verifyOTP = {
    body: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Please provide the user Id',
            'string.base': '# must be a string'.replace('#', 'Id'),
        }),
        OTP: Joi.string().required().messages({
            'string.empty': 'Please provide OTP',
            'string.base': '# must be number'.replace('#', 'OTP'),
        })
    })
};
const resendOTP = {
    body: Joi.object().keys({
        id: Joi.string().required().messages({
            'string.empty': 'Please provide the user Id',
            'string.base': '# must be number'.replace('#', 'Id'),
        })
    }),
};
const loginWithEmailOtp = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email address is required.'
        }),
        userRole: Joi.string().required().valid('User', 'Admin').messages({
            'string.empty': 'Please provide user role',
            'string.base': '# must be a string'.replace('#', 'User role')
        })
    })
};
const forgetPassword = {
    body: Joi.object().keys({
        sEmail: Joi.string().required(),
        sUserRole: Joi.string().required().valid('User', 'Admin').messages({
            'string.empty': 'Please provide user role',
            'string.base': '# must be a string'.replace('#', 'User role')
        }),
        // OTP: Joi.number().required(),
    }),
};

export default {
    login,
    forgotPassword,
    resetPassword,
    refreshTokens,
    register,
    verifyOTP,
    resendOTP,
    loginWithEmailOtp,
    forgetPassword

}