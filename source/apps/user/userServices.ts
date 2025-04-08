import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import Products from '../../model/productModel';
import countries from '../../model/countryModel';
import cartes from '../../model/myCartModel';
import states from '../../model/stateModel';
import cities from '../../model/cityModel';
import notificationData from '../../model/notificationModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import mongoose from 'mongoose';
import { visitFunctionBody } from 'typescript';
import products from '../../model/productModel';
import addProducts from '../../model/addProductModel';

const getAllUser = async (query: any) => {
    const searchFilter: any = { sUserRole: 'User' };
    const { limit, skip, sort, page } = getQueryOptions(query);
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sFullName"];
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    const dateFilter: any = {};
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

                // $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
                // $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

            }
        }
    }
    if (query.payment == false || query.payment == true) {
        searchFilter.sUsage = query.payment === false ? false : true;
        console.log(query.payment === false ? false : true, 'hello');
        console.log(searchFilter, 'searchFilter!!!!!!');


    } else {
        // searchFilter.subscribed = ""
    }
    console.log(searchFilter, 'searchFilter');


    if (query.subscription == false || query.subscription == true) {
        searchFilter.subscribed = query.subscription === false ? false : true;

    } else {
        // searchFilter.subscribed = ""

    }
    console.log(searchFilter, 'searchFilter!!!!!!!!');

    const user = await userModel.aggregate([
        {
            $match: {
                isOnboarding: true
            }
        },
        {
            $match: searchFilter
        },
        {
            $addFields: {
                sFullName: { '$concat': ['$sFirstName', ' ', '$sLastName'] }

            }
        },
        // {
        //     $match: searchFilter
        // },
        // {
        //     '$lookup': {
        //         'from': 'myroutines',
        //         'localField': 'oRoutineId',
        //         'foreignField': '_id',
        //         'as': 'myroutineData'
        //     }
        // },
        {
            '$project': {
                //'myroutineData': '$myroutineData',
                'sFirstName': 1,
                'sLastName': 1,
                'sEmail': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'subscribed': 1,
                'sStatus': 1,
                'sUserRole': 1,
                'sAddress': 1,
                'sClinicianCode': 1,
                'sUsage': 1,
                'sPassword': 1,
                'sProfileImage': 1,
                'isOnboarding': 1,
                'isStep': 1,
                "loweritem": { "$toLower": "$sFirstName" }
            }
        },
        {
            $match: searchFilter
        },
        {
            '$sort': {
                'createdAt': -1
            }
        },
        { '$sort': sort },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    console.log(user, 'user');

    const totalProduct = await userModel.count({ isOnboarding: true });
    return {
        userCount: totalProduct,
        user
    }
};

const updateStatusUser = async (id: any, body: any) => {
    const user: any = await userModel.findById(id);
    if (user) {
        return await userModel.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const deleteUser = async (id: any) => {
    return await userModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};

const addUserAddress = async (oUserId: any, body: any) => {
    let defaultAddress: any


    const userAddress: any = await userModel.findById({ _id: oUserId.user });
    console.log(oUserId.user, ' oUserId.user-------');


    let result: any
    if (userAddress.sAddress.length > 0) {
        let updatedAdressData: any = [];
        const emptyAddress = body.sAddress.filter((item: any) => !item._id)
        console.log(body.sAddress, 'body.sAddress--------');

        if (emptyAddress.length > 0) {
            console.log(emptyAddress.length > 0, 'hello------');

            updatedAdressData = emptyAddress.map((data: any) => {
                console.log(updatedAdressData, 'updatedAdressData-------');

                data._id = new mongoose.Types.ObjectId();
                return data
            });
        }
        const alreadyAddress = body.sAddress.filter((item: any) => item._id)
        userAddress.sAddress.forEach((add: any) => {
            console.log(userAddress.sAddress, 'kavya');

            const exist = alreadyAddress.filter((address: any) => address._id.toString() === add._id.toString())
            console.log(alreadyAddress, 'exist--------');

            if (exist[0]) {
                updatedAdressData.push(exist[0])
            } else {
                if (body.sAddress[0].defaultAddress === true) {
                    add.defaultAddress = false
                }
                updatedAdressData.push(add)
            }

        });
        body.sAddress = [...updatedAdressData];
        result = await userModel.findByIdAndUpdate({ _id: oUserId.user }, body, { new: true });

    } else {
        const bodyData = body.sAddress.map((item: any) => {

            item._id = new mongoose.Types.ObjectId();
            return item
        })
        body.sAddress = [...bodyData]

        result = await userModel.findByIdAndUpdate({ _id: oUserId.user }, body, { new: true });
        console.log(result, 'result--------');
    }
    return result


};
const getAllUserAddress = async (id: any) => {
    let pData: any
    pData = await Products.find({ _id: id, sStatus: { $ne: "Delete" } });
    if (pData.length > 0) {
        let category: any
        category = pData[0].sCategory;
        return await Products.find({ sCategory: category, sStatus: { $ne: "Delete" }, _id: { $ne: id } }).sort({ createdAt: -1 });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
}
const getNotification = async (oUserId: any) => {
    const notification: any = await notificationData.find({ userId: new mongoose.Types.ObjectId(oUserId.user) });
    if (notification) {
        return notification;
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const createNotification = async (body: any) => {
    let notification: any
    let userData = await userModel.find({})
    userData.forEach(async (value) => {
        body.userId = value._id
        notification = await notificationData.create(body);
    });
};
const notificationMarkRead = async (oUserId: any) => {
    console.log(oUserId, 'oUserId-------');
    const notification: any = await notificationData.updateMany({ isRead: true });
    if (notification) {
        return notification;
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
const readNotification = async (query: any) => {
    const searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);


    const readData = await notificationData.aggregate([
        {
            $match: {
                isRead: true
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    return readData
}
const unReadNotification = async (query: any) => {
    const searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);


    const readData = await notificationData.aggregate([
        {
            $match: {
                isRead: false
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    return readData
}
// const oneUser = async (req: any) => {

//     let pData: any
//     pData = await userModel.findOne({ _id: new mongoose.Types.ObjectId(req.id) });
//     console.log(new mongoose.Types.ObjectId(req.id), 'pData--------');

//     if (pData) {
//         return pData;
//     } else {
//         throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
//     }
// }
const oneUser = async (req: any) => {
    console.log(req, 'oUserId---------');
    console.log(req.user.user, "hello");

    let pData: any
    pData = await userModel.findOne({ _id: new mongoose.Types.ObjectId(req.user.user) });
    console.log(req.user.user, 'pData--------');

    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(req.query);

    let customFilter: any = {};
    if (req.query.search) {
        const { search, sort } = req.query;
        console.log(req.query, 'req.query--------');

        const searchFields = ["productName", "orderNumber"];
        console.log(searchFields, 'searchFields--------');

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    if (req.query.subscription == false || req.query.subscription == true) {
        searchFilter.subscribed = req.query.subscription === false ? false : true

    } else {
        // searchFilter.subscribed = ""
    }

    let UserData = await userModel.aggregate([
        // {
        //     '$match': {
        //         oUserId: new mongoose.Types.ObjectId(req.id.user),
        //     }
        // },
        {
            '$lookup': {
                'from': 'products',
                'localField': 'oProductId',
                'foreignField': '_id',
                'as': 'productData'
            }
        },
        {
            '$lookup': {
                'from': 'orders',
                'localField': 'sOrderId',
                'foreignField': '_id',
                'as': 'orderData'
            },
        },
        {
            '$lookup': {
                'from': 'myroutines',
                'localField': 'oRoutineId',
                'foreignField': '_id',
                'as': 'myroutineData'
            }
        },
        {
            $addFields: {
                productName: "$productData.sName",
                orderNumber: "$orderData.orderId"
            }
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'productData': '$productData',
                'orderData': '$orderData',
                'myroutineData': '$myroutineData',
                'sFirstName': 1,
                'sLastName': 1,
                'sEmail': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'subscribed': 1
            }
        },
        { '$skip': skip },
        { '$limit': limit },
    ])

    console.log(UserData, 'getMyRoutine----------');

    return {
        UserData,
    }

};

const singleUser = async (id: any) => {
    console.log(id, 'oUserId---------');
    console.log(id, "hello");

    let pData: any
    pData = await userModel.findById(id);
    console.log(id, 'pData--------');
    return pData
}

const updateUser = async (id: any, body: any) => {

    const user: any = await userModel.findById(id);
    console.log(user, 'brand');

    if (user) {
        return await userModel.findByIdAndUpdate({ _id: id }, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
const getCountryList = async () => {
    return await countries.find({});
};



const getStateList = async (query: any) => {
    return await states.find({ sCountryCode: query.sCountryCode });
};
const getCityList = async (query: any) => {
    return await cities.find({ stateCode: query.stateCode });
};
const deleteAddress = async (oUserId: any, id: any) => {
    let userData: any = await userModel.findById(new mongoose.Types.ObjectId(oUserId.user))
    console.log(userData, "userData-----");
    const alreadyAddress = userData.sAddress.filter((item: any) => item._id.toString() !== id.toString())
    userData.sAddress = alreadyAddress;

    return await userModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(oUserId.user) }, userData, { new: true });

};
const oneTimeProduct = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sOrderNo", "productName"];
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    const myOrder = await cartes.aggregate([
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
                                        sMonthly_subScription: 1
                                    }
                                }
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
            $addFields: {
                'productName': "$products.prodctData.sName"
            }
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'userData': '$userData',
                'products': '$products',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'productName': 1,
                'createdAt': 1,
                'updatedAt': 1,
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
const subScribeProduct = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);
    if (query.search) {
        const { search, sort } = query;
        console.log(query.search, 'kavya-------');

        const searchFields = ["sOrderNo", "productName"];
        console.log(searchFields, 'searchFields--------');
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
        console.log(searchFilter, 'searchFilter---------');
    }
    const myOrder = await cartes.aggregate([
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
                                        sMonthly_subScription: 1
                                    }
                                }
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
                'productName': "$products.prodctData.sName"
            }
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'userData': '$userData',
                'products': '$products',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'productName': 1,
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
const unSubScribeProduct = async (query: any) => {
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(query);
    if (query.search) {
        const { search, sort } = query;
        console.log(query.search, 'kavya-------');

        const searchFields = ["sOrderNo", "productName"];
        console.log(searchFields, 'searchFields--------');
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
        console.log(searchFilter, 'searchFilter---------');
    }
    const myOrder = await addProducts.aggregate([
        {
            $match: {
                sSubscription: {
                    $in:
                        ["UNSUBSCRIBED"]
                }
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
                            sSubscription: 1
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
                'productName': "$products.prodctData.sName"
            }
        },
        {
            $match: searchFilter
        },
        {
            '$project': {
                'userData': '$userData',
                'products': '$products',
                'prodctData': '$prodctData',
                'sOrderNo': 1,
                'sTotalAmount': 1,
                'sDeliveryPrice': 1,
                'sGrandAmount': 1,
                'createdAt': 1,
                'productName': 1,
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
const getOneUser = async (userId: any) => {
    console.log(userId, 'req');

    let pData: any
    //oUserId: new ObjectId(oUserId.user)
    pData = await userModel.findOne({ _id: new mongoose.Types.ObjectId(userId) });
    console.log(userId, 'pData--------');

    if (pData) {
        return pData;
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }

};

export default {
    getAllUser,
    updateStatusUser,
    deleteUser,
    addUserAddress,
    getAllUserAddress,
    //sendNotification,
    getNotification,
    createNotification,
    notificationMarkRead,
    oneUser,
    updateUser,
    singleUser,
    getCountryList,
    getStateList,
    getCityList,
    deleteAddress,
    oneTimeProduct,
    subScribeProduct,
    unSubScribeProduct,
    getOneUser,
    readNotification,
    unReadNotification
}
