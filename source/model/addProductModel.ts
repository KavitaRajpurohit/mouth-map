import { array, boolean, string } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const addProductSchema = new Schema({
    oProductId: Schema.Types.ObjectId,
    //oBrandId: Schema.Types.ObjectId,
    oCartId: {
        type: Schema.Types.ObjectId
    },
    sDiscount: String,
    sPrice: Number,
    sSubscription: {
        type: String,
        enum: ["SUBSCRIBED", "NOT_SUBSCRIBED"],
        default: "SUBSCRIBED"
    },
    sQuantity: {
        type: Number,
        min: [1, "Quantity can not be less then 1."],
    }
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const addProducts = mongoose.model("addProducts", addProductSchema);

export default addProducts;