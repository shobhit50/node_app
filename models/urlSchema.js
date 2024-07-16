const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    date: { type: String, default: Date.now },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});



module.exports = mongoose.model('Url', UrlSchema);