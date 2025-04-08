import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const mouthSchema = new Schema({

    userId: Schema.Types.ObjectId,
    mouthUpperTeeth: [],
    mouthDownTeeth: [],


}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const mouthMap = mongoose.model("mouthMap", mouthSchema);

export default mouthMap;