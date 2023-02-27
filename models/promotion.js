const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const promotionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true
        },
        featured: {
            type: Boolean,
            required: false
        },
        cost: {
            type: mongoose.Types.Currency,
            required: true
        },
        description: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const Promotion = mongoose.model('Promotion', promotionSchema);
module.exports = Promotion;