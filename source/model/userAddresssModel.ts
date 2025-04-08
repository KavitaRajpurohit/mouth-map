import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const userAddresssSchema = new Schema({
    oUserId: { type: Schema.Types.ObjectId, ref: 'users' },
    fullName: String,
    sHouseNo: String,
    sAddressLine1: String,
    sAddressLine2: String,
    sPostCode: String,
    stateName: Object,
    sCityName: Object,
    sCountryName: Object,

    defaultAddress: {
        type: Boolean,
        default: false
    },
    sStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Inactive"
    },

}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const address = mongoose.model("address", userAddresssSchema);

export default address;