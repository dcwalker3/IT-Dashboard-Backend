const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    lastOnline: {
        type: Date,
        default: Date.now
    },
    lastOffline: {
        type: Date,
        default: null
    },
    currentStatus: {
        type: String,
        default: 'online'
    },
}, {
    timestamps: true
});

const Site = mongoose.model('sites', SiteSchema);
module.exports = Site;