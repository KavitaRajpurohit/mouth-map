import { boolean } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const routineShema = new Schema({

    userId: Schema.Types.ObjectId,
    oBrandId: [Schema.Types.ObjectId],
    sBrushColor: Array,
    sBrushPinSize: Array,
    //sClinicianCode: Array,
    mouthUpperTeeth: [],
    mouthDownTeeth: [],
},

    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
    });
const myRoutines = mongoose.model("myRoutines", routineShema);

export default myRoutines;