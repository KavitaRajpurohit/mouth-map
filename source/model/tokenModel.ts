import { model, Schema } from "mongoose";
import constant from "../common/config/constant"
var mongoose = require('mongoose');

var tokensSchema = new Schema({
	token: { type: String, required: true, index: true, },
	type: {
		type: Number,
		required: true,
		enum: [
			constant.TOKEN_TYPE.ACCESS_TOKEN,
			constant.TOKEN_TYPE.REFRESH_TOKEN,
			constant.TOKEN_TYPE.VERIFICATION_TOKEN,
			constant.TOKEN_TYPE.RESET_PASSWORD
		]
	},
	expiresAt: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, required: true }
}, {
	timestamps: true,
	toObject: { getters: true },
	toJSON: { getters: true },
});
const Tokens = mongoose.model('Tokens', tokensSchema);

export default Tokens