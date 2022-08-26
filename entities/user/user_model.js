const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 3,
}

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowerCase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Enter a valid email address.'],
        unique: true
    },
    phone:{
        type: String,
        length: 11,
        required: true,
        match: [/^09[0-9]{9}$/, `Enter a phone number in '09*********' format.`]
    },
    password:{
        type: String,
        required: true,
    },
    posts:{
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Post'
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{ timestamps: true });


/*create a json web token with env-var private key */
userSchema.methods.generateAuthToken = function(){
    const token = jwt
        .sign({_id: this.id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.complexityOptions = complexityOptions;