import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const ProductSchema = new Schema({

    oBrandId: Schema.Types.ObjectId,
    //sOrderId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    sName: String,
    sProductImage: Array,
    nPrice: Number,
    sDescription: String,
    sMonthly_subScription: {
        type: Boolean,
        default: false
    },
    // sSubsctibed: {
    //     type: Boolean,
    //     default: false
    // },
    isCompleted: {
        type: Boolean,
        default: false
    },
    sStripeTransationId: String,
    qty: Number,
    //sScribedDate: Date,
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
const products = mongoose.model("products", ProductSchema);

export default products;