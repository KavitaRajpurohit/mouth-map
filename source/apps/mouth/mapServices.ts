
import pages from '../../model/pageModel';
import userModel from '../../model/userModel';
import { getQueryOptions } from '../../common/utils/getQueryParams';
import moment from 'moment';
import AppError from '../../common/utils/appError';
import constant from '../../common/config/constant';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import messages from '../../common/utils/messages/english';
import mouthMap from '../../model/mouthMapModel';
import myRoutines from '../../model/myRoutine';


const mouthTeeth = async (userId: any, body: any) => {
    await userModel.findById(userId.user)
    // await userModel.findByIdAndUpdate(req.userId, { isStep: 2 });
    const mouthData = await new mouthMap(body).save();
    await userModel.findByIdAndUpdate(userId.user, { isStep: 2 });
    return mouthData
};

const getmouthTeeth = async (id: any) => {
    let answers = await mouthMap.find({ userId: new mongoose.Types.ObjectId(id) });
    if (answers) {
        return answers;
    }
    else {
        throw new AppError(httpStatus.BAD_REQUEST, messages.RECORD_NOT_FOUND);
    }
};

export default {
    mouthTeeth,
    getmouthTeeth,
}