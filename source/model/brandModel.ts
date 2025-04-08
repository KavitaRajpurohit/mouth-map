
import { array, boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const BrandSchema = new Schema({

    sBrandName: {
        type: String,
        unique: true
    },
    sStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const brands = mongoose.model("brands", BrandSchema);

export default brands;