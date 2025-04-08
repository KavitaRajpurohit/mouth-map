import Joi from '@hapi/joi';
import message from '../../common/utils/messages/english';
// import languageUsed from './../../common/midlewares/languageGet';

const createCategory = {
    body: Joi.object().keys({
        sCategoryName: Joi.string(),
    })
};

const allCategory = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number()
    })
};

const updateCategory = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        sCategoryName: Joi.string(),

    })
};

const updateStatusCategory = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        sStatus: Joi.string()
    })
};

const createArticle = {
    body: Joi.object().keys({
        sCategoryId: Joi.array(),
        oProductId: Joi.string(),
        sArticleName: Joi.string(),
        sArticleImage: Joi.string(),
        sDescription: Joi.string(),
        sPin: Joi.boolean()
    })
};
const updateArticle = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        sCategoryId: Joi.array(),
        oProductId: Joi.string(),
        sArticleName: Joi.string(),
        sArticleImage: Joi.string(),
        sDescription: Joi.string(),
        sPin: Joi.boolean()

    })
};
const allArticle = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number()
    })
};
const updateStatusArticle = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        sStatus: Joi.string()
    })
};
const createVideo = {
    body: Joi.object().keys({
        sCategoryId: Joi.string(),
        oProductId: Joi.string(),
        sVideoName: Joi.string(),
        sVideoLink: Joi.string(),
    })
};

const updateVideo = {
    query: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object().keys({
        sCategoryId: Joi.string(),
        oProductId: Joi.string(),
        sVideoName: Joi.string(),
        sVideoLink: Joi.string(),

    })
};
const updateStatusVideo = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        sStatus: Joi.string()
    })
};

const allVideo = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number(),


    })
};
const addMyVideo = {
    body: Joi.object().keys({
        sVideoName: Joi.string(),
        sVideoLink: Joi.array(),
        sUserId: Joi.string()
    })
};
const getPatientList = {
    query: Joi.object().keys({
        search: Joi.string().allow('', null),
        page: Joi.number(),
        limit: Joi.number(),
        category: Joi.string().allow('', null),
        key: Joi.string().allow('', null),
    })
};
const updatePinStatus = {
    body: Joi.object().keys({
        sPinId: Joi.string().allow('', null),
        sUnPinId: Joi.string().allow('', null),

    })
};
export default {
    createCategory,
    allCategory,
    updateCategory,
    updateStatusCategory,
    createArticle,
    updateArticle,
    updatePinStatus,
    allArticle,
    updateStatusArticle,
    createVideo,
    updateVideo,
    updateStatusVideo,
    allVideo,
    addMyVideo,
    getPatientList
}
