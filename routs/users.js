//User Fields : id, name, phone, password

const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const selfOrAdmin = require('../middleware/selfOrAdmin');
const router = express.Router();
const Joi = require('joi');
const password_checking = require('joi-password-complexity');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

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
        lowerCase: true
    },
    phone:{
        type: String,
        length: 11,
        required: true
    },
    password:{
        type: String,
        required: true
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

userSchema.methods.generateAuthToken = function(){
    /*create a json web token with env-var private key */
    const token = jwt.sign({_id: this.id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);


//GET ALL
router.get('/', auth, async (req, res) => {
    const users = await User.find()
        .select('-password')
    res.send(users);
});

//GET BY ID
router.get('/:id', auth, async(req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password');
    if(!user) return res.status(404).send('ID dose not find');
    res.send(user);
});

//CREATE 
router.post('/', async(req, res) => {
    const { error } = dataValidation(req.body);
    if(error){
         return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    
    let user = await User.findOne({email : req.body.email});
    if(user) return res.status(400).send('User has already registerd!');

    user = await User.create(_.pick(req.body, ['name', 'email', 'phone', 'password', 'isAdmin']));

    /*Hashing the password */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token)
        .send(_.pick(user, ['_id', 'name', 'email', 'isAdmin', 'createdAt']));    
});


//UPDATE 
router.put('/:id', [auth, selfOrAdmin], async(req, res) => {
    const { error } = dataValidation(req.body);
    if(error) return res.status(400).send(`Bad request: ${error.details[0].message} `);

    /*Hashing the password */
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(req.params.id,
        _.pick(req.body, ['name', 'email', 'phone', 'password', 'isAdmin']), {new: true});
    if(!user) return res.status(404).send('ID dose not find');

    const token = user.generateAuthToken();

    res.header('x-auth-token', token)
        .send(_.pick(user, ['_id', 'name', 'email', 'isAdmin', 'createdAt', 'updatedAt']));
});

//DELETE 
router.delete('/:id', [auth, admin], async(req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('ID dose not find');
    res.send(user);
});


//functions
function dataValidation(data){
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(30).required().email(),
        phone: Joi.string().length(11).required(),
        password: Joi.string().required(),
        isAdmin: Joi.boolean()
    });
    const passwordCheking = password_checking(complexityOptions).validate(data.password);
    if(passwordCheking.error) return passwordCheking;
    else return schema.validate(data);
};

exports.router = router;
exports.User = User;
