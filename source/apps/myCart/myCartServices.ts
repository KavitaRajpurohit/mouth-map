import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import cartes from '../../model/myCartModel';
import addProducts from '../../model/addProductModel';
import shipping from '../../model/shippingModel';
import userModel from '../../model/userModel';
import Products from '../../model/productModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import constant from '../../common/config/constant';
import Tokens from '../../model/tokenModel';
import tokenService from '../../common/services/tokenService';
import mongoose from 'mongoose';



const addMyCart = async (oUserId: any, body: any) => {

    let cartData = await cartes.create({ 'oUserId': oUserId.user, 'oShippingId': body.oShippingId, 'shippingId': body.shippingId, 'billingId': body.billingId, 'sStatus': body.sStatus })
    body.product.forEach(async (value: any) => {
        await addProducts.create({ oCartId: cartData._id, oProductId: value.oProductId, sQuantity: value.sQuantity, oBrandId: value.oBrandId, "sPrice": value.sPrice, sSubscription: value.sSubscription, "sDiscount": value.sDiscount });
    });
    return cartData;
};
const addMyCartProduct = async (body: any) => {
    const cartProductData = await addProducts.find({ oCartId: (body.oCartId) });
    console.log(body.oCartId, 'cartProductData');
    await addProducts.create({ oCartId: body.oCartId, oProductId: body.oProductId, sQuantity: body.sQuantity, sPrice: body.sPrice, sSubscription: body.sSubscription, oBrandId: body.oBrandId, "sDiscount": body.sDiscount });
    console.log(cartProductData, 'hello');

    return cartProductData;
};

const deleteCart = async (id: any) => {
    return await cartes.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};
const deleteProductCart = async (id: any) => {
    return await addProducts.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
}

const getAllCart = async (oUserId: any, query: any) => {
    // if (query.subscription) {
    //     console.log(query.subscription, 'query.subscription');


    //     searchFilter.sMonthly_subScription = query.subscription === false ? false : true;
    // }
    const ObjectId = mongoose.Types.ObjectId;

    const user = await cartes.aggregate([
        {
            $match: {
                oUserId: new ObjectId(oUserId.user),
                sStatus: {
                    $in: ["IN_CART"]
                }
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
                                    },
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            oProductId: 1,
                            sPrice: 1,
                            oCartId: 1,
                            oBrandId: 1,
                            sQuantity: 1,
                            sDiscount: 1,
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
                                        sMonthly_subScription: 1
                                    }
                                }
                            ],
                            'as': 'prodctData'
                        }
                    }
                    // {
                    //     '$unwind': {
                    //         'path': '$prodctData',
                    //         'preserveNullAndEmptyArrays': true
                    //     }
                    // },
                ],
                'as': 'products'
            }
        },
        {
            '$project': {
                'shippingData': '$shippingData',
                'prodctData': '$prodctData',
                'products': '$products',
                //'subscribed': 1,
                //'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1,
            }
        },
    ]);
    console.log(user, 'user------------');
    return {
        user
    }
};
const updateMyCart = async (body: any) => {
    console.log(body, 'body--------');


    let cartProductData = await addProducts.findOne({ oCartId: new Object(body.oCartId), oProductId: new Object(body.oProductId) });

    if (cartProductData) {

        await addProducts.update({ oCartId: new mongoose.Types.ObjectId(cartProductData.oCartId), oProductId: new mongoose.Types.ObjectId(cartProductData.oProductId) }, { $set: { sQuantity: body.sQuantity, sPrice: body.sPrice, sSubscription: body.sSubscription, sMonthly_subScription: body.sMonthly_subScription, sDiscount: body.sDiscount } }, { new: true });
    } else {
        await addProducts.create({ oCartId: body.oCartId, oProductId: body.oProductId, sQuantity: body.sQuantity, sPrice: body.sPrice, sSubscription: body.sSubscription, oBrandId: body.oBrandId, sDiscount: body.sDiscount });
        console.log(new Object(body.oCartId), "kavya---------");

    }
    console.log(cartProductData, 'cartProductData');

    return cartProductData;
};
const addShipping = async (body: any) => {
    console.log(body, 'body');
    let brandData = await shipping.find({ isDeleted: { $in: false } })
    console.log(brandData, 'hello');

    if (brandData) {
        await shipping.update({ isDeleted: true })
    }
    return await shipping.create(body);
};
const getShipping = async (query: any) => {

    return await shipping.find({ isDeleted: query.isDeleted });
};
export default {
    addMyCart,
    deleteCart,
    getAllCart,
    updateMyCart,
    addShipping,
    getShipping,
    addMyCartProduct,
    deleteProductCart
}