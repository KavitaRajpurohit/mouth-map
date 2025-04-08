import httpStatus from 'http-status';
import messages from '../../common/utils/messages/english';
import userModel from '../../model/userModel';
import brands from '../../model/brandModel';
import cartes from '../../model/myCartModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import AppError from '../../common/utils/appError';
import address from '../../model/userAddresssModel';
import mongoose from 'mongoose';

const addUserAddress = async (oUserId: any, body: any) => {
    console.log(oUserId, 'oUserId');
    let userData = await userModel.findById({ _id: oUserId.user });
    console.log(userData, 'userData------');
    if (userData) {
        await address.update({ defaultAddress: false })
    }
    else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.NO_DATA);
    }
    //await address.findByIdAndUpdate({ _id: id }, body, { new: true });

    body['oUserId'] = oUserId.user;
    console.log(oUserId.user, 'hello');
    console.log(userData);
    return await address.create(body)
};
const updateAddress = async (id: any, body: any) => {

    let brandData = await address.find({ isDeleted: { $in: true } })
    console.log(brandData, 'hello');

    if (brandData) {
        await address.update({ defaultAddress: false })
    }
    await address.findByIdAndUpdate({ _id: id }, body, { new: true });
    // const userAddress: any = await address.findById(id);
    // console.log(userAddress, 'category');

    // if (userAddress) {

    //     return await address.findByIdAndUpdate({ _id: id }, body, { new: true });
    // } else {
    //     throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    // }
};

const deleteUserAddress = async (id: any) => {
    console.log(id, 'id-----------');
    return await address.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
};
const getUserAddress = async (id: any) => {
    console.log(id, 'oUserId');
    let answers = await address.find({ oUserId: new mongoose.Types.ObjectId(id) });

    //let answers: any = await address.findById(oUserId.user);
    if (answers) {
        return answers;
    }
    else {
        throw new AppError(httpStatus.BAD_REQUEST, messages.RECORD_NOT_FOUND);
    }
};
const updateAddressStatus = async (id: any, body: any) => {
    let brandData = await address.find({ isDeleted: { $in: true } })
    console.log(brandData, 'hello');

    if (brandData) {
        await address.update({ defaultAddress: false })
    }
    await address.findByIdAndUpdate({ _id: id }, body, { new: true });
};

const PostCodeList = async (req: any) => {
    console.log(req, 'req-----');


    const postData = await cartes.distinct((req.billingId, req.shippingId))
    console.log(req.shippingId, req.billingId, 'hello');
    return postData
    //return await cartes.find({ sStatus: { $in: "IN_ORDER" } });

};

export default {
    addUserAddress,
    updateAddress,
    deleteUserAddress,
    PostCodeList,
    getUserAddress,
    updateAddressStatus
}