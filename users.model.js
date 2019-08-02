const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
        unique: true,
        index: true,
    },
    authenticatorKey: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('User', schema)