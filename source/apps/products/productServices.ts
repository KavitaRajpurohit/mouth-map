import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import Products from '../../model/productModel';
import categories from '../../model/categoryModel';
import Promocode from '../../model/promocodeModel'
import brands from '../../model/brandModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import constant from '../../common/config/constant';
import Tokens from '../../model/tokenModel';
import tokenService from '../../common/services/tokenService';
import mongoose from 'mongoose';
import cartes from '../../model/myCartModel';
const { setNotification } = require('../../common/utils/pushNotification');


const createProduct = async (body: any) => {
    //let userData = await userModel.findById(id.user);
    // console.log(id.user, 'oUserId.user----------');
    // body['userId'] = id.user;
    const productBody = body;
    let str = body.sName;
    body.sName = str.trim()
    let brandData = await Products.findOne({ sName: productBody.sName, })
    console.log(productBody);
    if (brandData) {
        throw new AppError(httpStatus.CREATED, messages.ALREADY_EXITS_BRAND);

    }
    return await Products.create(productBody);
    // const productData: any = await userModel.find({})
    // const serverKey = "AAAAtuhwQ0k:APA91bH9qk75DK_5NCymfcJfEbYdHiAREQFn2h5YVOUgHkQ9GQZUbU_ZHoZVtRI-efxypTlRG2pcrtKnavUcHZq5loFABvRL2iUTC3HhqWMKUchLEfnL6t03IbYrHRtYFRuTrbcHjhPU"
    // const title = "New product launched!";
    // const message = "New product has been launched";
    // const loggedToken: any = productData.sDeviceToken;
    // console.log(productData.sDeviceToken, 'token');
    // let userData = await userModel.find({})
    // userData.forEach(async (value) => {
    //     body.userId = value._id
    //     userData = await setNotification(loggedToken, title, serverKey, message);
    //     console.log(userData, 'notData');
    //     //notification = await notificationData.create(body);
    // });
    //await userModel.createNotification(loggedToken, title, message, serverKey)

    //const notData = await setNotification(loggedToken, title, serverKey, message);
    //console.log(notData, 'notData');


};

const getallProduct = async (query: any) => {
    //let userData = await userModel.findById(id.user);

    const searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);

    let customFilter: any = {};
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sName"];

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }

    const product = await Products.aggregate([
        {
            $match: searchFilter,
            //'sStatus': 'Active'
        },

        {
            '$lookup': {
                'from': 'brands',
                'localField': 'oBrandId',
                'foreignField': '_id',
                'as': 'brandData'
            },

            // $match: {
            //     'brandData.sStatus': 'Active'
            // }

        },
        {
            '$project': {
                'brandData': '$brandData',
                'sName': 1,
                'sProductImage': 1,
                'sMonthly_subScription': 1,
                'nPrice': 1,
                'sDescription': 1,
                //'sSubsctibed': 1,
                'sStatus': 1,
                "loweritem": { "$toUpper": "$sName" },
            }
        },
        { "$sort": { "loweritem": 1 } },
        { '$skip': skip },
        { '$limit': limit },

    ]);
    console.log(product, 'product----------');
    const totalProduct = await Products.count({});

    return {
        productCount: totalProduct,
        product,
    }
};

const updateProduct = async (id: any, body: any) => {
    let productDetails = await Products.findOne({ sName: body.sName, sStatus: { $ne: "Delete" }, _id: { $ne: id } })
    console.log(productDetails, 'productDetails');

    // if (productDetails) {
    //     throw new AppError(httpStatus.BAD_REQUEST, messages.ALREADY_EXITS);
    // }
    const product: any = await Products.findById(id);

    if (product) {
        return await Products.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const deleteProduct = async (id: any) => {
    return await Products.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};

const updateStatusProduct = async (id: any, body: any) => {
    const product: any = await Products.findById(id);
    if (product) {
        return await Products.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
const allProductList = async (query: any) => {

    const product = await Products.aggregate([

        {
            $match: {
                sStatus: "Active"
            }
        },

    ]);
    //const totalProduct = await Products.count({});

    return {
        //productCount: totalProduct,
        product,
    }
};
const myBrushList = async (query: any) => {

    const brushData = await cartes.aggregate([
        {
            $match: {
                sStatus: "COMPLETE"
            }
        },

        {
            '$lookup': {
                'from': 'addproducts',
                'let': {
                    'cartId': '$_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$oCartId', '$$cartId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            oProductId: 1,
                            sPrice: 1,
                            sQuantity: 1,
                            createdAt: 1
                        }
                    },
                    {
                        '$lookup': {
                            'from': 'products',
                            'let': {
                                'productId': '$oProductId'
                            },
                            'pipeline': [
                                {
                                    '$match': {
                                        '$expr': {
                                            '$eq': [
                                                '$_id', '$$productId'
                                            ]
                                        }
                                    }
                                },
                                {
                                    '$project': {
                                        sName: 1,
                                        sProductImage: 1,
                                        nPrice: 1,
                                        createdAt: 1,
                                        updatedAt: 1
                                    }
                                }
                            ],
                            'as': 'prodctData'
                        }
                    }
                ],
                'as': 'products'
            }
        },
        {
            '$project': {
                'products': '$products',
                'sOrderNo': 1,
                'createdAt': 1,
                'updatedAt': 1,
                //'sStatus': 1,
            }
        },
    ]);
    //const totalProduct = await Products.count({});
    console.log(brushData, 'brushData-----------');

    return {
        brushData,
    }
};

export default {
    createProduct,
    getallProduct,
    updateProduct,
    deleteProduct,
    updateStatusProduct,
    allProductList,
    myBrushList
}
