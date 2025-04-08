import { boolean, string } from "@hapi/joi";
import { timeStamp } from "console";
import { model, Schema } from "mongoose";
var mongoose = require('mongoose');


const ArticleSchema = new Schema({

    sBrandName: String,
    sArticleName: String,
    //sCategoryId: Array,
    sCategoryId: [Schema.Types.ObjectId],
    oProductId: Schema.Types.ObjectId,
    sArticleImage: String,
    nPrice: Number,
    sDescription: String,
    sPin: {
        type: Boolean,
        default: false,
    },
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
const articles = mongoose.model("articles", ArticleSchema);

export default articles;