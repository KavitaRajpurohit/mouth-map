import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const pageSchema = new Schema({


    pTitle: String,
    pContent: String,
    pIdentifier: {
        type: String,
        enum: ["TERMSANDCONDITION ", "PRIVACYPOLICY"],
    },

}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const pages = mongoose.model("pages", pageSchema);

export default pages;