import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const PatientVideoSchema = new Schema({

    sVideoName: String,
    sVideoLink: String,
    oProductId: { type: Schema.Types.ObjectId },
    sCategoryId: Schema.Types.ObjectId,

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
const patientVideoes = mongoose.model("patientVideoes", PatientVideoSchema);

export default patientVideoes;