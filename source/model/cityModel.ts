import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const citySchema = new Schema({
    sCityName: String,
    sCountryCode: String,
    stateCode: String,



}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const cities = mongoose.model("cities", citySchema);

export default cities;