import { boolean, number } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const PromocodeSchema = new Schema({
    sApplicabletype: {
        type: String,
        enum: ["One time", "Subscribed"],
        default: "One time"
    },
    sPromocode: String,
    sValiditydate: Date,
    sPromoDes: String,
    sCriteria: {
        type: String,
        enum: ["flatdiscount", "discount"],
        default: "flatdiscount"
    },
    sAmount: String,
    sDiscount: String,
    sMinproductval: Number,
    sStatus: {
        type: String,
        enum: ["Active", "Expired"],
        default: "Active"
    },
    sRecurrence: {
        type: String,
        enum: ["Once", "Lifetime", "Repeats"],
        default: "Once"
    },
    sRepeats: {
        type: Number,
        min: [1, "Repeat atleast 1 time."],
    }
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const promocode = mongoose.model("promocode", PromocodeSchema);

export default promocode;