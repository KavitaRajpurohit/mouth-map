import httpStatus from 'http-status';
import appError from '../../common/utils/appError';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import myRoutines from '../../model/myRoutine';
import mouthMap from '../../model/mouthMapModel';
import brands from '../../model/brandModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import constant from '../../common/config/constant';
import Tokens from '../../model/tokenModel';
import tokenService from '../../common/services/tokenService';
import mongoose from 'mongoose';



const addRoutine = async (userId: any, body: any) => {
    console.log(userId, "userId-------");

    await userModel.findById(userId.user)
    console.log(userId.user, 'userId.user');

    const brand = body;
    // let str = body.sBrandName;
    // body.sBrandName = str.trim().toLowerCase()
    const myRoutine = await myRoutines.create(brand);
    console.log(myRoutine, 'myRoutine');

    await userModel.findByIdAndUpdate(userId.user, { $set: { sClinicianCode: body.sClinicianCode } }, { isStep: 3 });
    console.log(body.sClinicianCode, 'body');

    return myRoutine



};
const updateRoutine = async (userId: any, id: any, body: any) => {

    const routineData: any = await myRoutines.findById(id);
    const data = await userModel.findById(userId.user)
    console.log(userId.user, 'data!!!!!!!!!!!');



    console.log(id, 'brand');

    if (routineData) {
        const routineData = await myRoutines.findByIdAndUpdate({ _id: id }, body, { new: true });
        await userModel.findByIdAndUpdate(userId.user, { isStep: 4 });
        return routineData

    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};
// const addRoutine = async (id: any, body: any) => {
//     let user: any = await myRoutines.find(id);
//     console.log(user, 'user!!!!!!!');

//     console.log(id, 'hello');

//     const myRoutine: any = body;
//     //const user: any = await UserModel.findById(id);
//     if (user) {
//         console.log(user, 'user.length-------');

//         if (user) {
//             console.log(user, 'user.length-------');

//             return await myRoutines.findByIdAndUpdate({ _id: id }, body, { new: true });
//         } else {
//             return await myRoutines.create(myRoutine);
//         }
//     } else {
//         throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
//     }
// };
const getRoutine = async (oUserId: any) => {
    await userModel.findById(oUserId.user)
    console.log(oUserId.user, 'oUserId.user---------');



    console.log(oUserId, 'oUserId---------');

    let getMyRoutine = await myRoutines.aggregate([

        {
            '$match': {
                userId: new mongoose.Types.ObjectId(oUserId.user)
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
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'userData'
            },
        },


        {
            '$project': {
                'sClinicianCode': 1,
                'brandData': '$brandData.sBrandName',
                'userData': '$userData.sClinicianCode',
                'sBrushColor': 1,
                'sBrushPinSize': 1,
                'mouthUpperTeeth': 1,
                'mouthDownTeeth': 1

            }
        },
        {
            '$sort': {
                'createdAt': -1
            }
        },

    ])
    console.log(getMyRoutine, 'getMyRoutine----------');

    return {
        getMyRoutine
    }

};
const getBrandData = async (oUserId: any) => {
    console.log(oUserId, 'oUserId---------');

    let getMyRoutine = await myRoutines.aggregate([

        {
            '$match': {
                userId: new mongoose.Types.ObjectId(oUserId.user)
            }
        },


        {
            '$lookup': {
                'from': 'brands',
                'localField': 'oBrandId',
                'foreignField': '_id',
                'as': 'brandData'
            },
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'userData'
            },
        },

        {
            '$project': {
                'sClinicianCode': 1,
                'brandData': '$brandData',
                'userData': '$userData'

            }
        },

    ])
    console.log(getMyRoutine, 'getMyRoutine----------');
    return {
        getMyRoutine
    }
};

export default {

    addRoutine,
    getRoutine,
    getBrandData,
    updateRoutine

}