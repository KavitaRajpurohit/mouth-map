import { boolean, date } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const stripSchema = new Schema({

    userId: Schema.Types.ObjectId,
    exp_month: Number,
    exp_year: Number,
    customerId: String,
    cardId: String,
    sCardBrand: String,
    sCountry: String,
    cardNumber: Number,
    sCardType: String,

    //metadata: Object
    metadata: {
        defaultCard: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const stripPayment = mongoose.model("stripPayment", stripSchema);

export default stripPayment;