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

const updateProfile = async (id: any, body: any) => {
    const user: any = await userModel.findById(id);
    if (user) {
        return await userModel.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const checkUserById = async (body: any) => {
    const user = await userModel.findById(body.user);
    if (user) {
        return user;
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const changePassword = async (userId: any, body: any, user: any) => {
    const checkPassword = await bcrypt.compare(body.oldPassword, user.sPassword);
    if (checkPassword) {
        const hashPassword = await bcrypt.hash(body.newPassword, 8);
        return await updateProfile(userId.user, { sPassword: hashPassword });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.PASSWORD_INCORRECT);
    }
};

export default {
    updateProfile,
    checkUserById,
    changePassword
}
