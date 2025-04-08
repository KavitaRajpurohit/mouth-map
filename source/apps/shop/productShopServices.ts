import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import Products from '../../model/productModel';
import cartes from '../../model/myCartModel';
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

const getallProduct = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);

    let customFilter: any = {};
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sName", "brandName"];
        console.log(searchFields, 'searchFields--------');

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    if (query.brandData) {
        console.log(query.brandData, 'hello');

        const tempArray = JSON.parse(query.brandData).map((tag: any) => new mongoose.Types.ObjectId(tag));
        console.log(tempArray, 'tempArray------');

        console.log(query.brandData, 'filter brand--------');
        searchFilter = {
            ...searchFilter, brandName: {
                $in: tempArray
                //$eq: query.category
            }
        }
    }

    // if (query.brandData) {
    //     console.log(query.brandData, 'filter brand--------');
    //     searchFilter = {
    //         ...searchFilter, 'brandName': {
    //             $eq: query.brandData
    //         }
    //     }
    // }
    if (query.search && query.brandData) {
        const { search, sort } = query;
        const searchFields = ["sName", "brandName"];
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
        const tempArray = JSON.parse(query.brandData).map((tag: any) => new mongoose.Types.ObjectId(tag));
        searchFilter = {
            ...searchFilter, brandName: {
                $in: tempArray
            }
        }
        // searchFilter = {
        //     ...searchFilter, 'brandName': {
        //         $eq: query.brandData
        //     }
        // }
    }
    const product = await Products.aggregate([

        {
            $match: {
                sStatus: "Active"
            }
        },
        {
            '$lookup': {
                'from': 'brands',
                'localField': 'oBrandId',
                'foreignField': '_id',

                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    // {
                                    //     '$eq': [
                                    //         '$oFollowerId', '$$userId'
                                    //     ]
                                    // },
                                    //  {
                                    //     '$eq': [
                                    //         '$oUserId', new ObjectId(id)
                                    //     ]
                                    // },
                                    // {
                                    //     '$eq': ['$oTribeId', "$$tribeId"]
                                    // }
                                ]
                            }
                        }
                    }
                ],
                'as': 'brandData'
            }
        },
        {
            $addFields: {
                brandName: "$brandData._id",
            }
        },
        // {
        //     $addFields: {
        //         brandName: "$brandData.sBrandName",
        //     }
        // },
        {
            $match: searchFilter
        },

        {
            '$project': {
                'brandData': '$brandData',
                'sName': 1,
                'sProductImage': 1,
                'nPrice': 1,
                'sMonthly_subScription': 1,
                'sStatus': 1
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    console.log(product, 'productData-------');
    return {
        product
    }
};

const productDetails = async (id: any) => {
    console.log(id, 'id-------');
    const ObjectId = mongoose.Types.ObjectId;
    //const myShopData = await cartes.aggregate([

    let product = await Products.aggregate([

        {
            '$match': {
                _id: new mongoose.Types.ObjectId(id)
            }
        },

        {
            '$lookup': {
                'from': 'cartes',
                'localField': '_id',
                'foreignField': 'oProductId',
                'as': 'cartData'
            }
        },
        {
            '$lookup': {
                'from': 'brands',
                'localField': 'oBrandId',
                'foreignField': '_id',
                'as': 'brandData'
            }
        },
        {
            '$project': {
                'sBrandName': 1,
                "oBrandId": 1,
                'cartData': '$cartData',
                'brandData': '$brandData',
                'sName': 1,
                'sProductImage': 1,
                'sDescription': 1,
                'nPrice': 1,
                'sMonthly_subScription': 1
            }
        },

    ])
    return {
        product
    }
};

export default {
    getallProduct,
    productDetails

}
