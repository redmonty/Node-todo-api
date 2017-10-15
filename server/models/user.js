const mongoose = require('mongoose'),
    validator = require('validator'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
};
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};
UserSchema.statics.findByToken = function(token) {
    var user = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(err) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',

    }).catch((err) => {
        res.status(401).send();
    });
};
UserSchema.pre('save', function(next) {//middlewere - run code before save user
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
        // bcrypt.compare(hashPassword, user.password, (err, res) => {
        //     next();
        // }); 
    } else {
        next();
    }
});
const User = mongoose.model('User', UserSchema);



module.exports = {
    User
};