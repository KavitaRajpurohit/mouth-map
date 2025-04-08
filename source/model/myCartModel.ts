import { boolean, string } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const cartSchema = new Schema({

    oUserId: { type: Schema.Types.ObjectId },
    oPromoCodeId: { type: Schema.Types.ObjectId },
    shippingId: { type: Schema.Types.ObjectId },
    billingId: { type: Schema.Types.ObjectId },
    oShippingId: { type: Schema.Types.ObjectId },

    sTotalAmount: Number,
    //sDeliveryPrice: Number,
    sGrandAmount: Number,
    sOrderNo: {
        type: String
    },
    sStatus: {
        type: String,
        enum: ["IN_CART", "IN_ORDER", "ON_THE_WAY", "COMPLETE"],
        default: "IN_CART"
    }
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const cartes = mongoose.model("cartes", cartSchema);

export default cartes;