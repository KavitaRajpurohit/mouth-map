import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const stateSchema = new Schema({
    stateName: String,
    stateCode: String,
    sCountryCode: String

}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const states = mongoose.model("states", stateSchema);

export default states;