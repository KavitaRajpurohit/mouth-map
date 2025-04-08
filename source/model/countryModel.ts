import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const countrySchema = new Schema({
    sCountryName: String,
    sCountryCode: String

}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const countries = mongoose.model("countries", countrySchema);

export default countries;