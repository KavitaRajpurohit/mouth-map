import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import Products from '../../model/productModel';
import categories from '../../model/categoryModel';
import patientVideoes from '../../model/patientVideoModel';
import articles from '../../model/articleModel';
import myVideos from '../../model/myVideoModel';
import Promocode from '../../model/promocodeModel'
import brands from '../../model/brandModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import constant from '../../common/config/constant';
import Tokens from '../../model/tokenModel';
import tokenService from '../../common/services/tokenService';
import mongoose from 'mongoose';

const createCategory = async (body: any) => {
    const categoryBody = body;
    let str = body.sCategoryName;
    body.sCategoryName = str.trim()
    let category: any = await categories.findOne({ sCategoryName: categoryBody.sCategoryName })

    if (category) {
        throw new AppError(httpStatus.BAD_REQUEST, messages.ALREADY_EXITS_CATEGORY);
    }
    return await categories.create(categoryBody);
};

const getallCategory = async (query: any) => {
    const searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);

    let customFilter: any = {};
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sCategoryName"];
        console.log(searchFields, 'searchFields--------');

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    const category = await categories.aggregate([
        {
            $match: searchFilter
        },
        {
            "$project": {
                'sCategoryName': 1,
                'sStatus': 1,
                'createdAt': 1,
                "loweritem": { "$toUpper": "$sCategoryName" },

            }
        },
        { "$sort": { "loweritem": 1 } },
        //{ "$sort": { "sCategoryName": 1 } },

        { '$skip': skip },
        { '$limit': limit },
        // {
        //     '$sort': {
        //         '_id': -1
        //     }
        // },
    ]);
    console.log(category, 'category');
    const totalCategory = await categories.count({});

    return {
        categoryCount: totalCategory,
        category,
    }
};

const updateCategory = async (id: any, body: any) => {

    const category: any = await categories.findById(id);
    console.log(category, 'category');

    if (category) {
        return await categories.findByIdAndUpdate({ _id: id }, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};


const deleteCategory = async (id: any) => {
    console.log(id, 'id-----------');
    return await categories.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};

const updateStatusCategory = async (id: any, body: any) => {
    const category: any = await categories.findById(id);
    if (category) {
        return await categories.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
const createArticle = async (body: any) => {
    const articleBody = body;

    let str = body.sArticleName;
    body.sArticleName = str.trim()
    return await articles.create(articleBody);

};

const updateArticle = async (id: any, body: any) => {

    const article: any = await articles.findById(id);
    console.log(article, 'category');

    if (article) {
        return await articles.findByIdAndUpdate({ _id: id }, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
const updatePinStatus = async (body: any) => {
    console.log(body, 'body');

    if (body.unPinId) {
        console.log(body.unPinId, '!!!!!!!!!!!!!!!');

        await articles.update({ _id: body.unPinId }, { $set: { sPin: false } }, { new: true });
    }
    return await articles.update({ _id: body.pinId }, { $set: { sPin: true } }, { new: true });
};
const updateunPinStatus = async (body: any) => {
    console.log(body, 'body');

    if (body.pinId) {
        console.log(body.pinId, 'body.pinId');

        await articles.update({ _id: body.pinId }, { $set: { sPin: true } }, { new: true });
    }
    return await articles.update({ _id: body.unPinId }, { $set: { sPin: false } }, { new: true });
};


const deleteArticle = async (id: any) => {
    console.log(id, 'id-----------');
    return await articles.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};

const updateStatusArticle = async (id: any, body: any) => {
    const article: any = await articles.findById(id);
    if (article) {
        return await articles.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const createVideo = async (userId: any, body: any) => {
    console.log(userId, 'userId----------');

    const patientVideo = body;

    let str = body.sVideoName;
    body.sVideoName = str.trim()
    const videoData = await patientVideoes.create(patientVideo);
    //await userModel.findByIdAndUpdate(userId.user, { isOnboarding: true });
    return videoData

};

const updateVideo = async (id: any, body: any) => {

    const patientVideo: any = await patientVideoes.findById(id);
    console.log(patientVideo, 'category');

    if (patientVideo) {
        return await patientVideoes.findByIdAndUpdate({ _id: id }, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const deleteVideo = async (id: any) => {
    console.log(id, 'id-----------');
    return await patientVideoes.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};

const updateStatusVideo = async (id: any, body: any) => {
    console.log('hello');

    const video: any = await patientVideoes.findById(id);
    console.log("article--------");

    if (video) {
        return await patientVideoes.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const getallArticle = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);
    let customFilter: any = {};
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sArticleName"];
        console.log(searchFields, 'searchFields--------');

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    let product = await articles.aggregate([
        {
            '$lookup': {
                'from': 'categories',
                'localField': 'sCategoryId',
                'foreignField': '_id',
                'as': 'categoryData'
            }
        },

        {
            '$lookup': {
                'from': 'products',
                'localField': 'oProductId',
                'foreignField': '_id',
                'as': 'productData'
            }
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'ProductName': '$productData',
                'CategoryName': '$categoryData',
                'sArticleName': 1,
                'sArticleImage': 1,
                'sDescription': 1,
                'sStatus': 1,
                'sPin': 1,
                'createdAt': 1,
                "loweritem": { "$toUpper": "$sArticleName" },

            }
        },
        { "$sort": { "loweritem": 1 } },
        // { "$sort": { "sArticleName": 1 } },
        { '$skip': skip },
        { '$limit': limit },
        // {
        //     '$sort': {
        //         '_id': -1
        //     }
        // },

    ]);
    console.log(product, 'product---------------');
    const totalArticle = await articles.count({});

    return {
        articleCount: totalArticle,
        product
    }
};
const getPatientList = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);
    let customFilter: any = {};
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sArticleName"];
        console.log(searchFields, 'searchFields--------');

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    let currentDate: any = new Date();

    if (query.key) {
        if (query.key === "7day") {
            searchFilter.createdAt = {
                $gte: new Date(currentDate.setDate(currentDate.getDate() - 7)),
                $lte: new Date()
            }
        }
        if (query.key === "lastmonth") {
            searchFilter.createdAt = {
                $gte: new Date(currentDate.setMonth(currentDate.getMonth() - 1)),
                $lte: new Date()
            }
        }
    }
    // const tempArray = JSON.parse(query.category).map((a: any) => {
    //     return new mongoose.Types.ObjectId(a)
    // })
    if (query.category) {
        console.log(query.category, 'hello');

        const tempArray = JSON.parse(query.category).map((tag: any) => new mongoose.Types.ObjectId(tag));
        console.log(tempArray, 'tempArray------');

        console.log(query.category, 'filter brand--------');
        searchFilter = {
            ...searchFilter, categoryName: {
                $in: tempArray
                //$eq: query.category
            }
        }
    }
    console.log(searchFilter, 'searchFilter');


    let product = await articles.aggregate([
        {
            '$lookup': {
                'from': 'categories',
                'localField': 'sCategoryId',
                'foreignField': '_id',
                'as': 'categoryData'
            }
        },
        // {
        //     '$unwind': {
        //         'path': '$categoryData',
        //     }
        // },
        {
            $addFields: {
                categoryName: "$categoryData._id",
            }
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'CategoryName': '$categoryData',
                'sArticleName': 1,
                'sArticleImage': 1,
                'sDescription': 1,
                'sStatus': 1,
                'sPin': 1,
                'createdAt': 1,
                //'categoryName': 1

            }
        },
        { '$skip': skip },
        { '$limit': limit },
        {
            '$sort': {
                '_id': -1
            }
        },

    ]);
    console.log(product, 'product---------------');
    return product

};
const patientDetails = async (id: any) => {
    const ObjectId = mongoose.Types.ObjectId;
    let product = await articles.aggregate([

        {
            '$match': {
                _id: new mongoose.Types.ObjectId(id)
            }
        },

        {
            '$lookup': {
                'from': 'categories',
                'localField': 'sCategoryId',
                'foreignField': '_id',
                'as': 'categoryData'
            }
        },
        {
            '$project': {
                'CategoryName': '$categoryData',
                'sArticleName': 1,
                'sArticleImage': 1,
                'sDescription': 1,
                'sStatus': 1,
                'sPin': 1,
                'createdAt': 1

            }
        },

    ])
    console.log(product, 'product----------');
    return product;
    // return {
    //     product
    // }

};
// const patientDetails = async (id: any) => {
//     const user = await articles.findById(id)
//     return user
// };
const getallVideo = async (query: any) => {
    const searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);

    let customFilter: any = {};
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sVideoName"];
        console.log(searchFields, 'searchFields--------');

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }

    // const ObjectId = mongoose.Types.ObjectId;

    const patientVideo = await patientVideoes.aggregate([
        {
            $match: searchFilter
        },

        {
            '$lookup': {
                'from': 'products',
                'localField': 'oProductId',
                'foreignField': '_id',
                'as': 'productData'
            }
        },
        // {
        //     '$unwind': {
        //         'path': '$productData',
        //         'preserveNullAndEmptyArrays': true
        //     }
        // },

        {
            '$lookup': {
                'from': 'categories',
                'localField': 'sCategoryId',
                'foreignField': '_id',
                'as': 'categoryData'
            }
        },
        // {
        //     '$unwind': {
        //         'path': '$categoryData',
        //         'preserveNullAndEmptyArrays': true
        //     }
        // },
        {
            '$project': {
                'categoryData': '$categoryData',
                'ProductName': '$productData',
                'sVideoName': 1,
                'sVideoLink': 1,
                'sStatus': 1,
                "loweritem": { "$toUpper": "$sVideoName" },

            }
        },
        { "$sort": { "loweritem": 1 } },
        //{ "$sort": { "sVideoName": 1 } },

        { '$skip': skip },
        { '$limit': limit },
        // {
        //     '$sort': {
        //         '_id': -1
        //     }
        // },

    ]);
    const totalPatientVideo = await patientVideoes.count({});

    return {
        patientVideoCount: totalPatientVideo,
        patientVideo,
    }
};
const allCategoryList = async (query: any) => {

    const category = await categories.aggregate([
        {
            $match: {
                sStatus: "Active"
            }
        },
        {
            "$project": {
                'sCategoryName': 1,
                "loweritem": { "$toLower": "$sCategoryName" }
            }
        },
        { "$sort": { "loweritem": 1 } },
        // {
        //     $sort: {
        //         sCategoryName: 1
        //     }
        // }
    ]);
    //const totalCategory = await categories.count({});

    return {
        category,
    }
};

const addMyVideo = async (id: any, body: any) => {
    console.log(id, "id----------");

    let userData = await userModel.findById(id.user);
    console.log(userData, 'userData---------');
    body['userId'] = id.user
    const patientVideo = body;
    let str = body.sVideoName;
    body.sVideoName = str.trim().toLowerCase()
    const myVideo = await myVideos.create(patientVideo);
    await userModel.findByIdAndUpdate(id.user, { isOnboarding: true });
    console.log(id.user, "hello kavya");

    return myVideo
};

const getMyVideo = async (id: any) => {
    let userData = await userModel.findById(id.user);
    console.log(userData, 'userData--------');

    const myVideo = await myVideos.find({ sUserId: new mongoose.Types.ObjectId(id.user) });
    console.log({ sUserId: new mongoose.Types.ObjectId(id.user) }, 'hello');

    if (myVideo) {
        return myVideo;
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
const deleteMyVideo = async (id: any) => {
    console.log(id, 'id-----------');
    return await myVideos.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};
export default {
    createCategory,
    getallCategory,
    updateCategory,
    deleteCategory,
    updateStatusCategory,
    createArticle,
    updateArticle,
    deleteArticle,
    updateStatusArticle,
    getallArticle,
    createVideo,
    updateVideo,
    deleteVideo,
    updateStatusVideo,
    getallVideo,
    patientDetails,
    allCategoryList,
    addMyVideo,
    getMyVideo,
    deleteMyVideo,
    getPatientList,
    updatePinStatus,
    updateunPinStatus
}
