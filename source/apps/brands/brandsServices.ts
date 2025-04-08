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

const createBrand = async (body: any) => {
    const brand = body;
    const str = body.sBrandName;
    body.sBrandName = str.trim()
    let brandData = await brands.findOne({ sBrandName: brand.sBrandName, })
    console.log(brand);
    if (brandData) {
        throw new AppError(httpStatus.CREATED, messages.ALREADY_EXITS_BRAND);

    }
    return await brands.create(brand);

};

const getallBrand = async (query: any) => {
    const searchFilter: any = {};
    const { limit, skip, sort, page } = getQueryOptions(query);

    let customFilter: any = {};
    if (query.search) {
        const { search, sort } = query;
        const searchFields = ["sBrandName"];
        console.log(searchFields, 'searchFields--------');

        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    const brand = await brands.aggregate([
        {
            $match: searchFilter
        },
        {
            "$project": {
                'sBrandName': 1,
                'sStatus': 1,
                'createdAt': 1,
                "loweritem": { "$toUpper": "$sBrandName" },
            }
        },
        { "$sort": { "loweritem": 1 } },
        //{ "$sort": { "sBrandName": 1 } },
        { '$skip': skip },
        { '$limit': limit },
    ]);

    const totalBrand = await brands.count({});


    return {
        brandCount: totalBrand,
        brand,
    }
};

const updateBrand = async (id: any, body: any) => {

    const brand: any = await brands.findById(id);
    console.log(brand, 'brand');

    if (brand) {
        return await brands.findByIdAndUpdate({ _id: id }, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
};

const deleteBrand = async (id: any) => {
    return await brands.deleteOne({ _id: new mongoose.Types.ObjectId(id) })

};

const updateStatusBrand = async (id: any, body: any) => {
    const brand: any = await brands.findById(id);
    if (brand) {
        return await brands.findByIdAndUpdate(id, body, { new: true });
    } else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, messages.ID_NOT_FOUND);
    }
}
const brandAllList = async (query: any) => {

    const brand = await brands.aggregate([
        {
            $match: {
                sStatus: "Active"
            }
        },
    ]);
    return {
        brand,
    }
};


export default {
    createBrand,
    getallBrand,
    updateBrand,
    deleteBrand,
    updateStatusBrand,
    brandAllList
}
