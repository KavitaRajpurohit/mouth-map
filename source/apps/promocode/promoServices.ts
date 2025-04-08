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
import { query } from 'express';

const addPromoCode = async (body: any) => {
    //return await Promocode.create({ 'sApplicabletype': body.sApplicabletype, 'sPromocode': body.sPromocode, 'sValiditydate': body.sValiditydate, 'sPromoDes': body.sPromoDes, 'sCriteria': body.sCriteria, 'sAmount': body.sAmount, 'sDiscount': body.sDiscount, 'sMinproductval': body.sMinproductval, 'sStatus': body.sStatus, 'sRecurrence': body.sRecurrence, 'sRepeats': body.sRepeats })

    return await Promocode.create(body);
};

const editPromoCode = async (id: any, body: any) => {
    return await Promocode.findByIdAndUpdate(id, body, { new: true });
};

const getPromoCode = async (req: any) => {
    const { search } = req.query;
    let searchFilter: any = {};
    const { limit, skip, page } = getQueryOptions(req.query);


    if (search) {
        const searchFields = ["sPromocode"];
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }

    const getpromocode = await Promocode.aggregate([
        { $match: searchFilter },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    const totalPromoCode = await Promocode.count({});

    return {
        getpromocode,
        promoCode: totalPromoCode
    }
};
const getAppicablePcode = async (query: any) => {
    const { search, sMinproductval } = query;

    const { limit, skip, page } = getQueryOptions(query);
    let searchFilter: any = { sValiditydate: { $gte: new Date() }, sMinproductval: { $gte: Number(sMinproductval) } };
    if (search) {
        const searchFields = ["sPromocode"];
        searchFilter["$or"] = searchFields.map((field) => ({
            [field]: { $regex: search.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), $options: "i" },
        }));
    }
    const getpromocode = await Promocode.aggregate([
        { $match: searchFilter },
        { '$skip': skip },
        { '$limit': limit },
    ]);
    return {
        getpromocode
    }
};
const deletePromoCode = async (id: any) => {
    return await Promocode.deleteOne({ _id: new mongoose.Types.ObjectId(id) })

};

export default {
    addPromoCode,
    editPromoCode,
    getPromoCode,
    deletePromoCode,
    getAppicablePcode
}
