import { pick } from "lodash";
import mongoose from "mongoose";
import { model, Schema } from "mongoose";

import bcrypt from "bcryptjs";
import { array, string } from "@hapi/joi";

const userSchema = new mongoose.Schema({
    nNo: {
        type: Number
    },

    sFirstName: {
        type: String
    },
    sLastName: {
        type: String
    },
    sEmail: {
        type: String,
    },
    sPassword: {
        type: String,
    },
    sProfileImage: {
        type: String
    },
    // oRoutineId: Schema.Types.ObjectId,
    // sOrderId: Schema.Types.ObjectId,
    // oProductId: Schema.Types.ObjectId,
    OTP: {
        type: String
    },
    dOtpExpire: {
        type: Date
    },

    subscribed: {
        type: Boolean,
        default: false
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    isOnboarding: {
        type: Boolean,
        default: false
    },
    isStep: {
        type: Number,
        default: 1
    },
    sUserRole: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },
    sClinicianCode: Array,
    // sAddress: [{
    //     _id: Schema.Types.ObjectId,
    //     fullName: String,
    //     sHouseNo: String,
    //     sAddressLine1: String,
    //     sAddressLine2: String,
    //     sPostCode: String,
    //     stateName: Object,
    //     sCityName: Object,
    //     sCountryName: Object,

    //     defaultAddress: {
    //         type: Boolean,
    //         default: false
    //     },
    // }],

    sUsage: {
        type: Boolean,
        default: false
    },
    isNotificationGoal: {
        type: Boolean,
        default: true
    },
    sStripeCustomerId: String,
    sStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Inactive"
    },
    sDeviceToken: {
        type: String
    },
    sDevice: {
        type: String
    },
},
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
    });
userSchema.methods.transform = function () {
    const user = this;
    return pick(user.toJSON(), ['id', 'sFirstName', 'sLastName', 'sEmail', "sPassword", "OTP", "dOtpExpire", "isVerify", "isOnboarding", "sUserRole", "sStatus", "isStep", "sDeviceToken", "sDevice"]);
};
userSchema.pre('save', async function (next) {
    const user: any = this;
    let lastUser = await userModel.findOne({ sUserRole: "User" }, { nNo: 1 }).sort({ _id: -1 }).limit(1);
    if (lastUser) {
        let count: any
        count = lastUser.nNo;
        count = count + 1;
        user.nNo = count;
    } else {
        user.nNo = 1;
    }
    if (user.password) {
        user.password = await bcrypt.hash(user.password, 8);
        next();
    }
    next();
});

/** Use only when location data storage is required */
// userSchema.index({ location: '2dsphere' });

const userModel = mongoose.model("users", userSchema);
export default userModel