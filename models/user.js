const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

// Here, we're exporting a new Mongoose model called User, and saying it uses the userSchema as a framework
module.exports = mongoose.model('User', userSchema);