const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String }
}, { timestamps: true });

const Hotel = mongoose.model('Hotel', HotelSchema);
module.exports = Hotel;
