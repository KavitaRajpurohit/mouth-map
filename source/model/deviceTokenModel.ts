var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId

var DevictTokenSchema = new mongoose.Schema({
    userId: ObjectId,
    deviceToken: String,
    deviceType: String,
},
    {
        versionKey: false
    });

const Documents = mongoose.model('deviceTokens', DevictTokenSchema);
export default Documents;