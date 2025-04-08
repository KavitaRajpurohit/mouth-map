import { boolean, number } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const shippingSchema = new Schema({
    shippingPrice: {
        type: Number
    },
    shippingName: String,
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const shipping = mongoose.model("shipping", shippingSchema);

export default shipping;