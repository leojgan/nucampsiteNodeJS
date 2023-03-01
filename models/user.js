const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    }
});

// Here, we're exporting a new Mongoose model called User, and saying it uses the userSchema as a framework
module.exports = mongoose.model('User', userSchema);