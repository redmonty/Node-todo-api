const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 8
    },
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 2
    }
});

module.exports = {
    User
};