import { boolean, string } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const myVideoSchema = new Schema({

    sVideoName: String,
    sVideoLink: Array,
    sUserId: Schema.Types.ObjectId,
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
const myVideos = mongoose.model("myVideos", myVideoSchema);

export default myVideos;