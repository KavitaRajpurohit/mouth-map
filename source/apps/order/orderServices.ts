import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import cartes from '../../model/myCartModel';
import brands from '../../model/brandModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import mongoose from 'mongoose';
import products from '../../model/productModel';
import addProducts from '../../model/addProductModel';


const createOrder = async (oUserId: any, body: any) => {

    let userData = await cartes.find({ oUserId: oUserId.user, sStatus: { $ne: 'IN_CART' } });
    console.log(userData);
    const data = await cartes.findByIdAndUpdate({ _id: body.oCartId }, { $set: { sStatus: 'IN_ORDER', sOrderNo: userData.length + 1, shippingId: body.shippingId, billingId: body.billingId } }, { new: true });
    return data;
};
const getOderList = async (query: any, oUserId: any) => {
    const { limit, skip, page } = getQueryOptions(query);

    const searchFilter: any = {};
    const ObjectId = mongoose.Types.ObjectId;
    const user = await cartes.aggregate([
        {
            $match: {
                oUserId: new ObjectId(oUserId.user),
                sOrderNo: { $ne: null }
            }
        },
        {
            '$lookup': {
                'from': 'addresses',
                'localField': 'billingId',
                'foreignField': '_id',
                'as': 'addressData'
            }
        },
        {
            '$project': {
                'addressData': '$addressData',
                'sOrderNo': 1,
                'sGrandAmount': 1,
                //'billingId': 1,
                //'shippingId': 1,
                'createdAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    return user
};

const getPendingOrder = async (oUserId: any) => {
    // const ObjectId = mongoose.Types.ObjectId;
    // let customFilter: any = { oUserId: new ObjectId(oUserId.user) };
    // let searchFilter: any = {};
    // if (query.status) {
    //     customFilter = {
    //         ...customFilter, 'sStatus': {
    //             $eq: query.status
    //         }
    //     }
    // }
    // if (query.subscription === false || query.subscription === true) {
    //     searchFilter.subScribedProduct = query.subscription == false ? false : true

    // } else {
    //     // searchFilter.subscribed = ""

    // }
    const user = await cartes.aggregate([
        {
            $match: {
                oUserId: new mongoose.Types.ObjectId(oUserId.user),
                sStatus: {
                    $in: ["IN_ORDER"]
                }
            }
        },
        // {
        //     '$lookup': {
        //         'from': 'users',
        //         'localField': 'oUserId',
        //         'foreignField': '_id',
        //         'as': 'userData'
        //     }
        // },
        // {
        //     '$unwind': {
        //         'path': '$userData',
        //     }
        // },
        {
            '$lookup': {
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                                        sMonthly_subScription: 1,
                                        oBrandId: 1,
                                    }
                                },

                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            },

                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData',
                                    },
                                },

                            ],
                            'as': 'prodctData'
                        }


                    },
                    {
                        $unwind: {
                            path: '$prodctData',
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        // {
        //     $addFields: {
        //         'subScribedProduct': "$products.prodctData.sMonthly_subScription"
        //     }
        // },
        {
            '$project': {
                //'userData': '$userData',
                'promocodeData': '$promocodeData',
                'products': '$products',
                'brandData': '$brandData',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'billingId': 1,
                'shippingId': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1,
                //'subScribedProduct': 1
            }
        },
    ]);
    console.log(user, 'user-------');

    return user
};
const getOnTheWayOrder = async (oUserId: any) => {
    const user = await cartes.aggregate([
        {
            $match: {
                oUserId: new mongoose.Types.ObjectId(oUserId.user),
                sStatus: {
                    $in: ["ON_THE_WAY"]
                }
            }
        },
        {
            '$lookup': {
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                                        sMonthly_subScription: 1,
                                        oBrandId: 1,
                                    }
                                },

                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            },

                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData',
                                    },
                                },

                            ],
                            'as': 'prodctData'
                        }


                    },
                    {
                        $unwind: {
                            path: '$prodctData',
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        // {
        //     $addFields: {
        //         'subScribedProduct': "$products.prodctData.sMonthly_subScription"
        //     }
        // },
        {
            '$project': {
                'promocodeData': '$promocodeData',
                'products': '$products',
                'brandData': '$brandData',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'billingId': 1,
                'shippingId': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1,
            }
        },
    ]);
    console.log(user, 'user-------');

    return user
};
const getDeliveredOrder = async (oUserId: any) => {
    const user = await cartes.aggregate([
        {
            $match: {
                oUserId: new mongoose.Types.ObjectId(oUserId.user),
                sStatus: { $in: "COMPLETE" }
            }
        },
        {
            '$lookup': {
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                                        sMonthly_subScription: 1,
                                        oBrandId: 1,
                                    }
                                },

                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            },

                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData',
                                    },
                                },

                            ],
                            'as': 'prodctData'
                        }


                    },
                    {
                        $unwind: {
                            path: '$prodctData',
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        {
            '$project': {
                'promocodeData': '$promocodeData',
                'products': '$products',
                'brandData': '$brandData',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'billingId': 1,
                'shippingId': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1
            }
        },
    ]);
    console.log(user, 'user-------');

    return user
};
const viewOrderList = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sOrderNo", "userName"];
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    let currentDate: any = new Date();

    if (query.key && query.key != 'all') {
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
    if (query.product) {
        searchFilter = {
            ...searchFilter, 'productName': {
                $eq: query.product
            }
        }
    }
    if (query.brand) {
        searchFilter = {
            ...searchFilter, 'brandName': {
                $eq: query.brand
            }
        }
    }
    const myOrder = await cartes.aggregate([
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
        {
            $addFields: {
                userName: { '$concat': ['$userData.sFirstName', ' ', '$userData.sLastName'] }

            }
        },
        {
            '$lookup': {
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                            createdAt: 1,
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
                                        oBrandId: 1,
                                    }
                                },
                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            }
                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData'
                                    },
                                },
                            ],
                            'as': 'prodctData'
                        }
                    },
                    {
                        $unwind: {
                            path: '$prodctData'
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        {
            $addFields: {
                productName: "$products.prodctData.sName",
            }
        },
        {
            $addFields: {
                brandName: "$products.prodctData.brandData.sBrandName"
            }
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'userData': '$userData',
                'promocodeData': '$promocodeData',
                'products': '$products',
                'prodctData': '$prodctData',
                'brandData': '$brandData',
                'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    return {
        myOrder
    }
};
const orderDetails = async (query: any) => {
    const { limit, skip, page } = getQueryOptions(query);

    const myOrder = await cartes.aggregate([
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
                            createdAt: 1,
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
                                        sMonthly_subScription: 1,
                                        oBrandId: 1
                                    }
                                },
                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            }
                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData',
                                    },
                                },

                            ],
                            'as': 'prodctData'
                        }
                    },
                    {
                        $unwind: {
                            path: '$prodctData'
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        // {
        //     $addFields: {
        //         productName: "$products.prodctData.sName",
        //         //brandName: "$products.brandData.sBrandName"
        //     }
        // },
        {
            '$project': {
                'userData': '$userData',
                'promocodeData': '$promocodeData',
                'products': '$products',
                'prodctData': '$prodctData',
                'brandData': '$brandData',
                'billingId': 1,
                'shippingId': 1,
                'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    console.log(myOrder, 'getMyRoutine----------');
    return {
        myOrder
    }
};
const oneTimeProduct = async (query: any) => {
    const { limit, skip, page } = getQueryOptions(query);

    const myOrder = await cartes.aggregate([
        // {
        //     $match: {
        //         sStatus: { $ne: "IN_CART" }
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
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                            createdAt: 1,
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
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$_id', '$$productId'
                                                    ]
                                                }, {
                                                    '$eq': [
                                                        '$sMonthly_subScription', false
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    '$project': {
                                        sName: 1,
                                        sProductImage: 1,
                                        nPrice: 1,
                                        sMonthly_subScription: 1,
                                        oBrandId: 1
                                    }
                                },
                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            }
                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                // {
                                //     $unwind: {
                                //         path: '$brandData'
                                //     },
                                // },
                            ],
                            'as': 'prodctData'
                        }
                    },
                    {
                        $unwind: {
                            path: '$prodctData',
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        // {
        //     $addFields: {
        //         'subScribedProduct': "$products.prodctData.sMonthly_subScription"
        //     }
        // },
        {
            '$project': {
                'userData': '$userData',
                'promocodeData': '$promocodeData',
                'products': '$products',
                'brandData': '$brandData',
                'prodctData': '$prodctData',
                'billingId': 1,
                'shippingId': 1,
                'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    console.log(myOrder, 'getMyRoutine----------');
    return {
        myOrder
    }
};
const subScribeProduct = async (query: any) => {
    const { limit, skip, page } = getQueryOptions(query);

    const myOrder = await cartes.aggregate([
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
        {
            '$lookup': {
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                            createdAt: 1,
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
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$_id', '$$productId'
                                                    ]
                                                }, {
                                                    '$eq': [
                                                        '$sMonthly_subScription', true
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    '$project': {
                                        sName: 1,
                                        sProductImage: 1,
                                        nPrice: 1,
                                        sMonthly_subScription: 1,
                                        oBrandId: 1
                                    }
                                },
                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            }
                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData'
                                    },
                                },
                            ],
                            'as': 'prodctData'
                        }
                    },
                    {
                        $unwind: {
                            path: '$prodctData'
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        // {
        //     $addFields: {
        //         'subScribedProduct': "$products.prodctData.sMonthly_subScription"
        //     }
        // },
        {
            '$project': {
                'userData': '$userData',
                'promocodeData': '$promocodeData',
                'brandData': '$brandData',
                'products': '$products',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'billingId': 1,
                'shippingId': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    console.log(myOrder, 'getMyRoutine----------');
    return {
        myOrder
    }
};
const userOneTimeProduct = async (query: any, oUserId: any) => {
    const { limit, skip, page } = getQueryOptions(query);

    const myOrder = await cartes.aggregate([
        {
            $match: {
                oUserId: new mongoose.Types.ObjectId(oUserId.user),
                sStatus: { $ne: "IN_CART" }
            }
        },
        {
            '$lookup': {
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                            createdAt: 1,
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
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$_id', '$$productId'
                                                    ]
                                                }, {
                                                    '$eq': [
                                                        '$sMonthly_subScription', false
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    '$project': {
                                        sName: 1,
                                        sProductImage: 1,
                                        nPrice: 1,
                                        sMonthly_subScription: 1,
                                        sDescription: 1,
                                        oBrandId: 1
                                    }
                                },
                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            }
                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData'
                                    },
                                },
                            ],
                            'as': 'prodctData'
                        }
                    },
                    {
                        $unwind: {
                            path: '$prodctData',
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        {
            '$project': {
                'promocodeData': '$promocodeData',
                'products': '$products',
                'brandData': '$brandData',
                'prodctData': '$prodctData',
                'billingId': 1,
                'shippingId': 1,
                'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    console.log(myOrder, 'getMyRoutine----------');
    return {
        myOrder
    }
};
const userSubScribeProduct = async (oUserId: any, query: any) => {
    const { limit, skip, page } = getQueryOptions(query);

    const myOrder = await cartes.aggregate([
        {
            $match: {
                oUserId: new mongoose.Types.ObjectId(oUserId.user),
                sStatus: { $ne: "IN_CART" }
            }
        },
        {
            '$lookup': {
                'from': 'promocode',
                'localField': 'oPromoCodeId',
                'foreignField': '_id',
                'as': 'promocodeData'
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
                            createdAt: 1,
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
                                            '$and': [
                                                {
                                                    '$eq': [
                                                        '$_id', '$$productId'
                                                    ]
                                                }, {
                                                    '$eq': [
                                                        '$sMonthly_subScription', true
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    '$project': {
                                        sName: 1,
                                        sProductImage: 1,
                                        nPrice: 1,
                                        sMonthly_subScription: 1,
                                        sDescription: 1,
                                        oBrandId: 1
                                    }
                                },
                                {
                                    '$lookup': {
                                        'from': 'brands',
                                        'let': {
                                            'brandId': '$oBrandId'
                                        },
                                        'pipeline': [
                                            {
                                                '$match': {
                                                    '$expr': {
                                                        '$eq': [
                                                            '$_id', '$$brandId'
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                '$project': {
                                                    oBrandId: 1,
                                                    sBrandName: 1
                                                }
                                            }
                                        ],
                                        'as': 'brandData'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: '$brandData'
                                    },
                                },
                            ],
                            'as': 'prodctData'
                        }
                    },
                    {
                        $unwind: {
                            path: '$prodctData'
                        },
                    },

                ],
                'as': 'products'
            }
        },

        {
            $unwind: {
                path: '$products',
            },
        },
        {
            '$project': {
                'promocodeData': '$promocodeData',
                'brandData': '$brandData',
                'products': '$products',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'billingId': 1,
                'shippingId': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'sStatus': 1,
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    console.log(myOrder, 'getMyRoutine----------');
    return {
        myOrder
    }
};
const updateQuantity = async (id: any, body: any) => {

    const productData: any = await addProducts.findById(id);
    console.log(productData, 'productData');

    if (productData) {
        return await addProducts.findByIdAndUpdate({ _id: id }, body, { new: true });
    } else {
        throw new appError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
export default {
    createOrder,
    getOderList,
    getPendingOrder,
    getOnTheWayOrder,
    getDeliveredOrder,
    viewOrderList,
    orderDetails,
    oneTimeProduct,
    subScribeProduct,
    userOneTimeProduct,
    userSubScribeProduct,
    updateQuantity
}