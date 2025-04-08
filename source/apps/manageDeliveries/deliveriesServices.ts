import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import cartes from '../../model/myCartModel';
import address from '../../model/userAddresssModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import constant from '../../common/config/constant';
import Tokens from '../../model/tokenModel';
import tokenService from '../../common/services/tokenService';
import mongoose from 'mongoose';
import products from '../../model/productModel';
import addProducts from '../../model/addProductModel';


const getDeliveriesList = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);
    const ObjectId = mongoose.Types.ObjectId;
    let currentDate: any = new Date();
    if (query.status && query.status != 'all') {
        console.log(query.status, 'status');

        searchFilter.sStatus = query.status
        console.log(searchFilter.sStatus, 'searchFilter.sStatus');
    }

    let date: any = {};
    let { dateFilter } = query;
    if (query.dateFilter) {
        var curdate = new Date(dateFilter);
        date.createdAt = {
            $gte: new Date(dateFilter),
            $lt: new Date(curdate.setDate(curdate.getDate() + 1))
        }
    }
    // if (query.Postcode) {
    //     console.log(query.Postcode, 'filter brand--------');
    //     searchFilter = {
    //         ...searchFilter, 'postCode': {
    //             $eq: query.Postcode
    //         }
    //     }
    // }
    if (query.status && query.dateFilter && query.Postcode) {
        searchFilter.sStatus = query.status
        var curdate = new Date(dateFilter);
        date.createdAt = {
            $gte: new Date(dateFilter),
            $lt: new Date(curdate.setDate(curdate.getDate() + 1))
        }
        searchFilter = {
            ...searchFilter, 'postCode': {
                $eq: query.Postcode
            }
        }
    }
    else {

    }

    const deliveriesData = await cartes.aggregate([
        {
            $match: {
                sStatus: { $ne: "IN_CART" }
            }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'oUserId',
                'foreignField': '_id',
                'as': 'userData'
            }
        },
        {
            '$unwind': {
                'path': '$userData',
            }
        },
        // {
        //     $addFields: {
        //         postCode: "$userData.sAddress.sPostCode",
        //     }
        // },
        {
            $match: date
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'userData': '$userData',
                'sOrderNo': 1,
                'sStatus': 1,
                'createdAt': 1

            }
        },
        { '$skip': skip },
        { '$limit': limit },

    ]);
    return {
        deliveriesData,
    }
};
const orderDetails = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);

    let customFilter: any = {};
    const ObjectId = mongoose.Types.ObjectId;
    if (query.status) {
        console.log(query.status, 'status');

        searchFilter.sStatus = query.status
        console.log(searchFilter.sStatus, 'searchFilter.sStatus');
    }
    const orderData = await cartes.aggregate([
        // {
        //     $match: {
        //         oUserId: new ObjectId(oUserId.user)
        //     }
        // },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'oUserId',
                'foreignField': '_id',
                'as': 'userData'
            }
        },
        {
            '$unwind': {
                'path': '$userData',
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
                            oBrandId: 1,
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
                                        nPrice: 1
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
            $match: searchFilter
        },
        // {
        //     $addFields: {
        //         'subscribed': "$userData.subscribed"
        //     }
        // },
        {
            '$project': {
                'userData': '$userData',
                'products': '$products',
                'subscribed': 1,
                'sOrderNo': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    return {
        orderData,
    }
};
const orderDeliveriesStatus = async (oCartId: any, body: any) => {
    console.log(oCartId, 'id-------');

    let brand: any = await addProducts.findById({ _id: new mongoose.Types.ObjectId(oCartId) });
    console.log(oCartId, 'hello');

    if (brand) {
        return await cartes.update(body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
}

export default {
    getDeliveriesList,
    orderDetails,
    orderDeliveriesStatus
}
