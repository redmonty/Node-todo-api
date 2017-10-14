const mongoose = require('mongoose'),
    validator = require('validator');

const User = mongoose.model('User', {
    email: {
        type: String,
        trim: true,
        required: true,
        minlength: 8,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} isnt a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = {
    User
};